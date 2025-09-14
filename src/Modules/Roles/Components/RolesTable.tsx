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
import { LuSearch, LuPlus, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useRoles } from '../Hooks/RoleHook';
import RoleDetailModal from './RoleDetailModal';
import CreateRoleModal from './CreateRoleModal';
import type { Role } from '../Models/Role';
import { EditRoleModal } from './EditRolModal';
import { getStatusClass, getStatusDisplay } from '@/Modules/Usuarios/Helper/utils';




const Roles = ({ onClose }: { onClose: () => void }) => {
  const { data: roles = [], isLoading } = useRoles();
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [showRoleDetail, setShowRoleDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const columnHelper = createColumnHelper<Role>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('Nombre_Rol', {
        header: 'Nombre del Rol',
        cell: info => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('permisos', {
        header: 'Permisos',
        cell: info => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {info.getValue()?.length ?? 0} permisos
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

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

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

  const handleRowClick = (role: Role) => {
    setSelectedRoleId(role.Id_Rol);
    setShowRoleDetail(true);
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start h-full p-6">
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex justify-between items-center gap-4">
            {/* Search */}
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

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <LuPlus className="w-4 h-4" />
                Nuevo Rol
              </button>
              <button
                onClick={() => onClose()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Usuarios
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
         
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-2 bg-white border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-semibold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> a{' '}
            <span className="font-semibold">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getPrePaginationRowModel().rows.length)}</span> de{' '}
            <span className="font-semibold">{table.getPrePaginationRowModel().rows.length}</span> resultados
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 flex items-center gap-2">
              <span className="hidden md:inline">Tamaño de página:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 border border-gray-400 rounded-lg bg-white shadow min-w-[70px] text-sm "
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 rounded-full border border-gray-300 bg-gray-50 text-gray-500 hover:bg-blue-100 hover:text-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Página anterior"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg shadow">
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

      {/* Create Role Modal */}
      {showCreateModal && (
        <CreateRoleModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit Role Modal */}
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

      {/* Role Detail Modal */}
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