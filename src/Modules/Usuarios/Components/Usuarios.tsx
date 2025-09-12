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
import { LuSearch, LuFilter, LuPlus, LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { useUsers } from '../Hooks/userHook';
import type { Usuario } from '../Models/Usuario';
import CreateUserModal from './CreateUserModal';
import UserDetailModal from './UserDetailModal';
import { NombreUsuarioCell, getStatusClass, getStatusDisplay, isUserActive } from '../Helper/utils';
import RolesTable from '../../Roles/Components/RolesTable';
import FilterModal from './FilterModal';
import type { FilterOptions } from '../Types/UserTypes';

const Usuarios = () => {
  const { data: users = [], isLoading } = useUsers();
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showRolesTable, setShowRolesTable] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({});

  // Función para aplicar filtros personalizados
  const applyCustomFilters = (data: Usuario[], filters: FilterOptions): Usuario[] => {
    return data.filter(user => {
      // Filtro por rol
      if (filters.rol && user.rol?.Nombre_Rol !== filters.rol) {
        return false;
      }

      // Filtro por estado
      if (filters.estado) {
        const userIsActive = isUserActive(user.Fecha_Eliminacion);
        if (filters.estado === 'activo' && !userIsActive) return false;
        if (filters.estado === 'inactivo' && userIsActive) return false;
      }

      // Filtro por fecha (asumiendo que tienes un campo de fecha de creación)
      if (filters.fechaCreacionDesde || filters.fechaCreacionHasta) {
        // Implementa según el campo de fecha que tengas en tu modelo
        // Por ejemplo: user.Fecha_Creacion
      }

      // Búsqueda avanzada
      if (filters.busquedaAvanzada) {
        const searchTerm = filters.busquedaAvanzada.toLowerCase();
        const matchesId = user.Id_Usuario.toString().includes(searchTerm);
        const matchesEmail = user.Correo_Electronico.toLowerCase().includes(searchTerm);
        const matchesName = user.Nombre_Usuario.toLowerCase().includes(searchTerm);
        
        if (!matchesId && !matchesEmail && !matchesName) {
          return false;
        }
      }

      return true;
    });
  };

  // Aplicar filtros personalizados a los datos
  const filteredUsers = useMemo(() => {
    return applyCustomFilters(users, appliedFilters);
  }, [users, appliedFilters]);

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
      columnHelper.accessor('rol.Nombre_Rol', {
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

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const table = useReactTable({
    data: filteredUsers, // Usar datos filtrados en lugar de users
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
    setSelectedUserId(user.Id_Usuario);
    setShowUserDetail(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setAppliedFilters(filters);
    // Resetear a la primera página cuando se aplican filtros
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  // Contador de filtros activos
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
      {/* Mostrar solo la tabla de roles si está activa */}
      {showRolesTable ? (
        <RolesTable onClose={() => setShowRolesTable(false)} />
      ) : (
        <>
          {/* Controls */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-center gap-4">
              {/* Search */}
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

              {/* Buttons */}
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
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <LuPlus className="w-4 h-4" />
                  Nuevo
                </button>
                <button
                  onClick={() => setShowRolesTable(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Roles
                </button>
              </div>
            </div>

            {/* Mostrar filtros activos */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {appliedFilters.rol && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Rol: {appliedFilters.rol}
                    <button
                      onClick={() => handleApplyFilters({ ...appliedFilters, rol: '' })}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {appliedFilters.estado && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Estado: {appliedFilters.estado}
                    <button
                      onClick={() => handleApplyFilters({ ...appliedFilters, estado: '' })}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => handleApplyFilters({})}
                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
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
              {activeFiltersCount > 0 && (
                <span className="text-blue-600 ml-2">(filtrados de {users.length} total)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 flex items-center gap-2">
                <span className="hidden md:inline">Tamaño de página:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => table.setPageSize(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-400 rounded-lg bg-white shadow min-w-[70px] text-sm"
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
        </>
      )}

      {/* Modals - Movidos FUERA del condicional para que siempre se muestren */}
      {showCreateModal && (
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
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  </div>
);
};

export default Usuarios;