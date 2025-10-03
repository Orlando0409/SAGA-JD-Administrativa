import React, { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table';
import { 
  LuSearch, 
  LuEye, 
  LuChevronUp, 
  LuChevronDown,
  LuTrendingUp,
  LuTrendingDown,
  LuCalendar,
  LuUser,
  LuPackage,
  LuArrowLeft,
  LuPlus
} from 'react-icons/lu';
import { 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight 
} from "react-icons/md";
import { useGetAllMovimientos } from '../../hooks/HookMaterialMovimiento';
import DetailMovimientoModal from './DetailMovimientoModal';
import CreateMovimientoModal from './CreateMovimientoModal';
import type { MovimientoMaterial } from '../../models/Inventario';

interface CatalogoMovimientosProps {
  onBack?: () => void;
}

const CatalogoMovimientos: React.FC<CatalogoMovimientosProps> = ({ onBack }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoMaterial | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const { data: movimientos = [], isLoading, error, refetch } = useGetAllMovimientos();

  // Refetch data cuando se actualice
  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('refreshInventario', handler);
    return () => window.removeEventListener('refreshInventario', handler);
  }, [refetch]);

  const columnHelper = createColumnHelper<MovimientoMaterial>();

  const columns = [
    columnHelper.display({
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const movimiento = row.original;
        const isIngreso = movimiento.Tipo_Movimiento?.includes('Entrada');
        
        return (
          <div className="flex items-center gap-2">
            {isIngreso ? (
              <LuTrendingUp className="text-green-600" size={16} />
            ) : (
              <LuTrendingDown className="text-red-600" size={16} />
            )}
            <span className={`text-sm font-medium ${
              isIngreso ? 'text-green-700' : 'text-red-700'
            }`}>
              {movimiento.Tipo_Movimiento || 'N/A'}
            </span>
          </div>
        );
      },
      size: 120,
    }),

    columnHelper.accessor('Material.Nombre_Material', {
      id: 'material',
      header: 'Material',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <LuPackage className="text-gray-400" size={14} />
          <span className="text-sm font-medium">{getValue() || 'N/A'}</span>
        </div>
      ),
      size: 200,
    }),

    columnHelper.accessor('Cantidad', {
      id: 'cantidad',
      header: 'Cantidad',
      cell: ({ getValue, row }) => {
        const cantidad = getValue();
        const unidad = row.original.Material?.Unidad_Medicion;
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion || unidad?.Nombre_Unidad || '';
        
        return (
          <span className="text-sm">
            {cantidad?.toLocaleString()} {nombreUnidad}
          </span>
        );
      },
      size: 120,
    }),

    columnHelper.accessor('Usuario_Creador.Nombre_Usuario', {
      id: 'usuario',
      header: 'Usuario',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <LuUser className="text-gray-400" size={14} />
          <span className="text-sm">{getValue() || 'N/A'}</span>
        </div>
      ),
      size: 150,
    }),

    columnHelper.accessor('Fecha_Movimiento', {
      id: 'fecha',
      header: 'Fecha',
      cell: ({ getValue }) => {
        const fecha = getValue();
        if (!fecha) return 'N/A';
        
        const fechaObj = new Date(fecha);
        return (
          <div className="flex items-center gap-2">
            <LuCalendar className="text-gray-400" size={14} />
            <span className="text-sm">
              {fechaObj.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}
            </span>
          </div>
        );
      },
      size: 120,
    }),

    columnHelper.display({
      id: 'stock_anterior',
      header: 'Stock Anterior',
      cell: ({ row }) => {
        const movimiento = row.original;
        const unidad = movimiento.Material?.Unidad_Medicion;
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion || unidad?.Nombre_Unidad || '';
        
        return (
          <span className="text-sm text-gray-600">
            {movimiento.Cantidad_Anterior?.toLocaleString() || '0'} {nombreUnidad}
          </span>
        );
      },
      size: 120,
    }),

    columnHelper.display({
      id: 'stock_nuevo',
      header: 'Stock Actual',
      cell: ({ row }) => {
        const movimiento = row.original;
        const unidad = movimiento.Material?.Unidad_Medicion;
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion || unidad?.Nombre_Unidad || '';
        
        return (
          <span className="text-sm font-medium">
            {movimiento.Cantidad_Nueva?.toLocaleString() || '0'} {nombreUnidad}
          </span>
        );
      },
      size: 120,
    }),

    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(row.original)}
            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            title="Ver detalles"
          >
            <LuEye size={16} />
          </button>
        </div>
      ),
      size: 80,
      enableSorting: false,
    }),
  ];

  const table = useReactTable({
    data: movimientos,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleViewDetails = (movimiento: MovimientoMaterial) => {
    setSelectedMovimiento(movimiento);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedMovimiento(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    refetch(); // Refrescar los datos después de crear
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando movimientos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error al cargar movimientos</div>
          <div className="text-gray-600">Por favor, intenta recargar la página</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Volver al dashboard"
            >
              <LuArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Volver al Dashboard</span>
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h2>
          </div>
        </div>
      </div>

      
        {/* Controles */}
        <div className="flex items-center justify-between gap-4">

          {/* Barra de búsqueda */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LuSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="block w-[30vw] pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar movimientos..."
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <LuPlus className="h-4 w-4" />
            Nuevo Movimiento
          </button>
        </div>

      {/* Tabla */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <LuChevronUp
                              className={`h-3 w-3 ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <LuChevronDown
                              className={`h-3 w-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Mostrar:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {pageSizeOptions.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">elementos</span>
            </div>

          </div>

          {/* Controles de navegación */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Primera página"
            >
              <MdKeyboardDoubleArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <MdKeyboardArrowLeft className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página siguiente"
            >
              <MdKeyboardArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <MdKeyboardDoubleArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {movimientos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No hay movimientos registrados</div>
            <div className="text-gray-400">Los movimientos de inventario aparecerán aquí</div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedMovimiento && (
        <DetailMovimientoModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          movimiento={selectedMovimiento}
        />
      )}

      {/* Modal de crear movimiento */}
      <CreateMovimientoModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default CatalogoMovimientos;