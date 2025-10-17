import { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { LuSearch, LuPlus } from 'react-icons/lu';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useRoles, useDeactivateRole, useActivateRole } from '../Hooks/RoleHook';
import RoleDetailModal from './RoleDetailModal';
import CreateRoleModal from './CreateRoleModal';
import type { Role } from '../Models/Role';
import { EditRoleModal } from './EditRolModal';
import { isActive } from '@/Modules/Usuarios/Helper/utils';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
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

const Roles = () => {
  const { data: allRoles = [], isLoading } = useRoles();
  const { canCreate, canEdit } = useUserPermissions();
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [showRoleDetail, setShowRoleDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos'); // Por defecto mostrar todos los roles
  const [_selectedRole, setSelectedRole] = useState<Role | null>(null);
  const deactivateRoleMutation = useDeactivateRole();
  const activateRoleMutation = useActivateRole();

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const roles = useMemo(() => {
    if (estadoFilter === 'Todos') {
      return allRoles;
    }
    return allRoles.filter(role => {
      const roleIsActive = isActive(role.Fecha_Eliminacion);
      if (estadoFilter === 'Activo') return roleIsActive;
      if (estadoFilter === 'Inactivo') return !roleIsActive;
      return true;
    });
  }, [allRoles, estadoFilter]);

  const columnHelper = createColumnHelper<Role>();

  const handleViewDetail = (role: Role) => {
    setSelectedRoleId(role.Id_Rol);
    setShowRoleDetail(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setSelectedRoleId(role.Id_Rol);
    setShowEditModal(true);
  };

  const handleDeactivate = async (roleId: number) => {
    try {
      await deactivateRoleMutation.mutateAsync(roleId);
    } catch (error) {
      console.error('Error deactivating role:', error);
    }
  };

  const handleActivate = async (roleId: number) => {
    try {
      await activateRoleMutation.mutateAsync(roleId);
    } catch (error) {
      console.error('Error activating role:', error);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('Nombre_Rol', {
        header: 'Nombre del Rol',
        cell: info => (
          <div className="flex justify-start">
            <span className="font-medium transition-colors text-left w-full">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('Permisos', {
        header: 'Permisos',
        cell: info => (
          <div className="flex justify-start">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
              {info.getValue()?.length ?? 0} Permisos
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
          const roleIsActive = isActive(info.row.original.Fecha_Eliminacion);
          
          return (
            <div className="flex justify-center gap-1">
              <button
                className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                onClick={() => handleViewDetail(info.row.original)}
                title="Ver detalles"
              >
                Ver
              </button>
              {canEdit('usuarios') && (
                <button
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  onClick={() => handleEdit(info.row.original)}
                  title="Editar"
                >
                  Editar
                </button>
              )}
              {canEdit('usuarios') && (
                <>
                  {roleIsActive ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          disabled={deactivateRoleMutation.isPending}
                          title="Desactivar rol"
                        >
                          Desactivar
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Desactivar rol?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas desactivar el rol "{info.row.original.Nombre_Rol}"?</span>
                            <br />
                            <span>Si lo haces, se desactivarán los usuarios con este rol!</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => handleDeactivate(info.row.original.Id_Rol)}
                            disabled={deactivateRoleMutation.isPending}
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
                          disabled={activateRoleMutation.isPending}
                          title="Activar rol"
                        >
                          Activar
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Activar rol?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas activar el rol "{info.row.original.Nombre_Rol}"?</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={() => handleActivate(info.row.original.Id_Rol)}
                            disabled={activateRoleMutation.isPending}
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
    [deactivateRoleMutation.isPending, activateRoleMutation.isPending, canEdit]
  );

  const table = useReactTable({
    data: roles,
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
        <div className="flex pl-6 items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Roles
          </h1>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar roles..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-700"
              >
                <option value="Todos">Todos los roles</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>

              {canCreate('usuarios') && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <LuPlus className="w-4 h-4" />
                  Nuevo
                </button>
              )}
            </div>
          </div>
        </div>

<div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div className="overflow-x-auto">
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
                    <td colSpan={4} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                      {globalFilter ? 'No se encontraron roles que coincidan con la búsqueda' : 'No hay roles registrados'}
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
      </div>

   
      {showCreateModal && (
        <CreateRoleModal onClose={() => setShowCreateModal(false)} />
      )}

   
      {showEditModal && selectedRoleId && (
        <EditRoleModal
          roleId={selectedRoleId}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRoleId(null);
          }}
        />
      )}

   
      {showRoleDetail && selectedRoleId && (
        <RoleDetailModal
          roleId={selectedRoleId}
          isOpen={showRoleDetail}
          onClose={() => {
            setShowRoleDetail(false);
            setSelectedRoleId(null);
          }}
        />
      )}
    </div>
  );
};

export default Roles;