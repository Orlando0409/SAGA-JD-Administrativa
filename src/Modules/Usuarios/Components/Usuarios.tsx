import { useState, useMemo, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { LuSearch, LuFilter, LuPlus, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';
import { useUsers } from '../Hooks/userHook';
import type { Usuario } from '../Models/Usuario';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';
import { NombreUsuarioCell, getStatusClass, getStatusDisplay, isActive } from '../Helper/utils';
import RolesTable from '../../Roles/Components/RolesTable';
import type { FilterOptions } from '../Types/UserTypes';
import FilterUserModal from './FilterUserModal';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
import { useAuth } from '@/Modules/Auth/Context/AuthContext';

const Usuarios = () => {
  const { data: users = [], isLoading, refetch } = useUsers();
  const { canCreate, canEdit, canView } = useUserPermissions();
  const { user: currentUser } = useAuth();
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showRolesTable, setShowRolesTable] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({ estado: 'activo' }); // Por defecto solo activos

  const hasViewPermission = canView('usuarios');
  const hasEditPermission = canEdit('usuarios');
  const hasCreatePermission = canCreate('usuarios');

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  useEffect(() => {
    const handler = () => {
      refetch(); 
    };
    window.addEventListener('refreshUsuarios', handler);
    return () => window.removeEventListener('refreshUsuarios', handler);
  }, [refetch]);

  const usersToShow = useMemo(() => {
    if (isLoading || !users?.length) return [];

    if (hasEditPermission) {
      return users;
    }
    
    // Si solo puede ver, mostrar solo su usuario
    if (hasViewPermission && currentUser?.Id_Usuario) {
      const myUser = users.find(user => user.Id_Usuario === currentUser.Id_Usuario);
      return myUser ? [myUser] : [];
    }
    
    return [];
  }, [users, hasEditPermission, hasViewPermission, currentUser?.Id_Usuario, isLoading]);

  const applyCustomFilters = (data: Usuario[], filters: FilterOptions): Usuario[] => {
    return data.filter(user => {
      // Aplicar filtro de rol si está definido
      if (filters.rol && user.Rol?.Nombre_Rol !== filters.rol) {
        return false;
      }

      // Aplicar filtro de estado
      const userIsActive = isActive(user.Fecha_Eliminacion);
      if (filters.estado === 'activo' && !userIsActive) return false;
      if (filters.estado === 'inactivo' && userIsActive) return false;
      if (filters.estado === 'todos') return true; // Mostrar todos
      if (!filters.estado && !userIsActive) return false; // Si no hay filtro específico, ocultar inactivos

      return true;
    });
  };

  const filteredUsers = useMemo(() => {
    return applyCustomFilters(usersToShow, appliedFilters);
  }, [usersToShow, appliedFilters]);

  const columnHelper = createColumnHelper<Usuario>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('Nombre_Usuario', {
        header: 'Nombre de Usuario',
        cell: info => <NombreUsuarioCell value={info.getValue()} />,
      }),
      columnHelper.accessor('Correo_Electronico', {
        header: 'Correo Electrónico',
      }),
      columnHelper.accessor('Rol.Nombre_Rol', {
        header: 'Rol',
        cell: info => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('Fecha_Eliminacion', { 
        header: 'Estado',
        cell: info => (
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(info.getValue())}`}>
            {getStatusDisplay(info.getValue())}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredUsers, 
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const handleRowClick = (user: Usuario) => {
    if (!user?.Id_Usuario) return;
    
    const canViewDetails = hasEditPermission || user.Id_Usuario === currentUser?.Id_Usuario;
    
    if (canViewDetails) {
      setSelectedUserId(user.Id_Usuario);
      setShowUserDetail(true);
    }
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const activeFiltersCount = Object.values(appliedFilters).filter(v => v && v !== '').length;

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start h-full p-2">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Título principal */}
        <div className="p-6 ">
          <h1 className="text-2xl font-bold text-gray-800">
            {showRolesTable ? 'Gestión de Roles' : 'Gestión de Usuarios'}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {showRolesTable 
              ? 'Administra los roles y permisos del sistema' 
              : 'Administra los usuarios y sus accesos al sistema'
            }
          </p>
        </div>

        {hasViewPermission && !hasEditPermission && (
          <div className="p-4 bg-blue-50">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Modo de solo lectura:</strong> Solo puedes ver tu información de usuario.
                </p>
              </div>
            </div>
          </div>
        )}

        {showRolesTable ? (
          <RolesTable onClose={() => setShowRolesTable(false)} />
        ) : (
          <>
            {(hasEditPermission || filteredUsers.length > 1) && (
              <div className="p-6 bg-white">
                <div className="flex justify-between items-center gap-4">

                    <div className="relative flex-1 max-w-md">
                      <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                  {hasEditPermission && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowFilterModal(true)}
                        className={`px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 ${
                          activeFiltersCount > 0 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <LuFilter className="w-4 h-4" />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </button>

                      {hasCreatePermission && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                          <LuPlus className="w-4 h-4" />
                          Nuevo
                        </button>
                      )}

                      <button
                        onClick={() => setShowRolesTable(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        Roles
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
              <table className="min-w-full table-auto">
                <thead className="bg-sky-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100 cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="flex items-center gap-1">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                            {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-sky-50">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                        {globalFilter ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr 
                        key={row.id} 
                        className="hover:bg-sky-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-white ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Filas por página:</span>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                      }}
                      className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-sm"
                    >
                      {pageSizeOptions.map(size => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="px-2 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Página anterior"
                    >
                      <LuChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg">
                      {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="px-2 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Página siguiente"
                    >
                      <LuChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {showCreateModal && hasCreatePermission && (
          <CreateUserModal onClose={() => setShowCreateModal(false)} />
        )}
        
        {showUserDetail && selectedUserId && (
          <UserDetailModal
            userId={selectedUserId}
            isOpen={showUserDetail}
            onClose={() => {
              setShowUserDetail(false);
              setSelectedUserId(null);
            }}
          />
        )}

        {hasEditPermission && (
          <FilterUserModal
            isOpen={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={handleApplyFilters}
            currentFilters={appliedFilters}
          />
        )}
      </div>
    </div>
  );
};

export default Usuarios;