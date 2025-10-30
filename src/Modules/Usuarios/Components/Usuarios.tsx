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
import { LuSearch, LuFilter, LuPlus } from 'react-icons/lu';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useUsers, useDeactivateUser, useActivateUser } from '../Hooks/userHook';
import type { Usuario } from '../Models/Usuario';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';
import EditUserModal from './EditUserModal';
import { isActive } from '../Helper/utils';
import type { FilterOptions } from '../Types/UserTypes';
import FilterUserModal from './FilterUserModal';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
import { useAuth } from '@/Modules/Auth/Context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Modules/Global/components/Sidebar/ui/alert-dialog';

const Usuarios = () => {
  const { data: users = [], isLoading, refetch } = useUsers();
  const {canEdit, canView } = useUserPermissions();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({ estado: 'todos' }); // Por defecto solo activos
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  
  const deactivateUserMutation = useDeactivateUser();
  const activateUserMutation = useActivateUser();

  const hasViewPermission = canView('usuarios');
  const hasEditPermission = canEdit('usuarios');

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

  const handleViewDetail = (user: Usuario) => {
    setSelectedUserId(user.Id_Usuario);
    setShowUserDetail(true);
  };

  const handleEdit = (user: Usuario) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeactivate = async (userId: number) => {
    try {
      await deactivateUserMutation.mutateAsync({ id: userId });
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleActivate = async (userId: number) => {
    try {
      await activateUserMutation.mutateAsync({ id: userId });
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('Nombre_Usuario', {
        header: 'Nombre de Usuario',
        cell: info => (
          <span className="font-medium transition-colors text-left w-full">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('Correo_Electronico', {
        header: 'Correo Electrónico',
        cell: info => (
          <div className="flex justify-start">
            <div className="text-gray-600 max-w-xs truncate">
              {info.getValue()}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('Rol.Nombre_Rol', {
        header: 'Rol',
        cell: info => (
          <div className="flex justify-start">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('Fecha_Eliminacion', { 
        header: 'Estado',
        cell: info => {
          const activo = isActive(info.getValue());
          return (
            <div className="flex justify-start">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activo 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: info => {
          const userIsActive = isActive(info.row.original.Fecha_Eliminacion);
          const canViewDetails = hasEditPermission || info.row.original.Id_Usuario === currentUser?.Id_Usuario;
          
          return (
            <div className="flex justify-center gap-1">
              {canViewDetails && (
                <button
                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                  onClick={() => handleViewDetail(info.row.original)}
                  title="Ver detalles"
                >
                  Ver
                </button>
              )}
              {hasEditPermission && (
                <button
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  onClick={() => handleEdit(info.row.original)}
                  title="Editar"
                >
                  Editar
                </button>
              )}
              {hasEditPermission && (
                <>
                  {userIsActive ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          disabled={deactivateUserMutation.isPending}
                          title="Desactivar usuario"
                        >
                          Desactivar
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Desactivar usuario?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas desactivar el usuario "{info.row.original.Nombre_Usuario}"?</span>
                            <br />
                            <span>Esta acción puede revertirse posteriormente.</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => handleDeactivate(info.row.original.Id_Usuario)}
                            disabled={deactivateUserMutation.isPending}
                          >
                            <span>Desactivar</span>
                          </AlertDialogAction>
                          <AlertDialogCancel>
                            <span>Cancelar</span>
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                          disabled={activateUserMutation.isPending}
                          title="Activar usuario"
                        >
                          Activar
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Activar usuario?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas activar el usuario "{info.row.original.Nombre_Usuario}"?</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => handleActivate(info.row.original.Id_Usuario)}
                            disabled={activateUserMutation.isPending}
                          >
                            <span>Activar</span>
                          </AlertDialogAction>
                          <AlertDialogCancel>
                            <span>Cancelar</span>
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [deactivateUserMutation.isPending, activateUserMutation.isPending, hasEditPermission, currentUser?.Id_Usuario]
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
      <div className="w-full overflow-hidden">

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
          <div className="flex pl-6 items-center gap-4 ">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Usuarios
            </h1>
          </div>

          {(hasEditPermission || filteredUsers.length > 1) && (
            <div className="p-6">
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

                    {hasEditPermission && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        <LuPlus className="w-4 h-4" />
                        Nuevo
                      </button>
                    )}

                    <button
                      onClick={() => navigate({ to: '/Usuarios/Roles' })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      Roles
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

            <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                <table className="min-w-full table-auto">
                  <thead className="bg-sky-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                        {headerGroup.headers.map((header, index) => (
                          <th
                            key={header.id}
                            className={`px-2 sm:px-4 py-3 font-medium border-b border-sky-100 ${
                              index === 0 ? 'text-left' : 'text-center'
                            }`}
                          >
                            {(() => {
                              if (header.isPlaceholder) {
                                return null;
                              }
                              if (header.column.getCanSort()) {
                                return (
                                  <button
                                    type="button"
                                    className={`cursor-pointer select-none flex items-center gap-2 bg-transparent border-none p-0 ${
                                      index === 0 ? 'justify-start' : 'justify-center'
                                    }`}
                                    onClick={header.column.getToggleSortingHandler()}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        header.column.getToggleSortingHandler()?.(e);
                                      }
                                    }}
                                    tabIndex={0}
                                    aria-label={`Ordenar por ${header.column.columnDef.header as string}`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {header.column.columnDef.header as string}
                                      {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                                      {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                                    </span>
                                  </button>
                                );
                              }
                              return (
                                <span className={index === 0 ? 'text-left' : 'text-center'}>
                                  {header.column.columnDef.header as string}
                                </span>
                              );
                            })()}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-sky-50">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                          {globalFilter ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr 
                          key={row.id} 
                          className="hover:bg-sky-50 cursor-pointer transition-colors"
                        >
                          {row.getVisibleCells().map((cell, index) => (
                            <td key={cell.id} className={`px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top ${
                              index === 0 ? 'text-left' : 'text-center'
                            }`}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-3 bg-white border-t border-gray-200">
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
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Primera página"
                      >
                        <MdKeyboardDoubleArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Página anterior"
                      >
                        <MdKeyboardArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <span className="text-sm text-gray-700 min-w-[120px] text-center">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                      </span>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Página siguiente"
                      >
                        <MdKeyboardArrowRight className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Última página"
                      >
                        <MdKeyboardDoubleArrowRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {showCreateModal && hasEditPermission && (
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

        {showEditModal && selectedUser && (
          <EditUserModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            usert={selectedUser}
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