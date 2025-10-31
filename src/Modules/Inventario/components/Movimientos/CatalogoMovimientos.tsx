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
  LuTrendingUp,
  LuTrendingDown,
  LuCalendar,
  LuUser,
  LuArrowLeft,
  LuPlus,
  LuFilter
} from 'react-icons/lu';
import { 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from "react-icons/md";
import { 
  useGetAllMovimientos, 
  useGetMovimientosEntradas, 
  useGetMovimientosSalidas,
  useGetMovimientosEntreFechas 
} from '../../hooks/useMovimientos';
import { getMovimientosLoadingState, getMovimientosErrorState } from '../../helper/MovimientosHelpers';
import DetailMovimientoModal from './DetailMovimientoModal';
import CreateMovimientoModal from './CreateMovimientoModal';
import FilterMovimientosModal from './FilterMovimientosModal';
import type { MovimientoMaterial } from '../../models/Inventario';
import type { MovimientoFilterOptions } from '../../types/MovimientosTypes';
import type { TipoMovimiento } from '../../models/MovimientoMaterial';

interface CatalogoMovimientosProps {
  onBack?: () => void;
}

const CatalogoMovimientos: React.FC<CatalogoMovimientosProps> = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoMaterial | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MovimientoFilterOptions>({});

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  // Hooks para obtener movimientos según el tipo
  const { data: todosMovimientos = [], isLoading: isLoadingTodos, error: errorTodos, refetch: refetchTodos } = useGetAllMovimientos();
  const { data: movimientosEntradas = [], isLoading: isLoadingEntradas, error: errorEntradas, refetch: refetchEntradas } = useGetMovimientosEntradas();
  const { data: movimientosSalidas = [], isLoading: isLoadingSalidas, error: errorSalidas, refetch: refetchSalidas } = useGetMovimientosSalidas();
  
  // Hook para filtro por fechas - solo se habilita cuando hay fechas aplicadas
  const hasFechas = !!appliedFilters.fechaInicio && !!appliedFilters.fechaFin;
  const { data: movimientosPorFechas = [], isLoading: isLoadingFechas, error: errorFechas, refetch: refetchFechas } = useGetMovimientosEntreFechas(
    appliedFilters.fechaInicio || '',
    appliedFilters.fechaFin || '',
    hasFechas
  );

  // Seleccionar los datos según los filtros aplicados 
  const movimientos = React.useMemo(() => {
    // Prioridad 1: Filtro por fechas
    if (hasFechas) {
      return movimientosPorFechas;
    }
    
    // Prioridad 2: Filtro por tipo de movimiento
    if (appliedFilters.soloIngresos) {
      return movimientosEntradas;
    }
    if (appliedFilters.soloEgresos) {
      return movimientosSalidas;
    }
    
    // Default: todos los movimientos
    return todosMovimientos;
  }, [
    hasFechas, 
    movimientosPorFechas,
    appliedFilters.soloIngresos, 
    appliedFilters.soloEgresos, 
    todosMovimientos, 
    movimientosEntradas, 
    movimientosSalidas
  ]);

  const isLoading = getMovimientosLoadingState(
    appliedFilters,
    hasFechas,
    {
      todos: isLoadingTodos,
      entradas: isLoadingEntradas,
      salidas: isLoadingSalidas,
      fechas: isLoadingFechas
    }
  );
  
  const error = getMovimientosErrorState(
    appliedFilters,
    hasFechas,
    {
      todos: errorTodos,
      entradas: errorEntradas,
      salidas: errorSalidas,
      fechas: errorFechas
    }
  );

  const refetch = () => {
    refetchTodos();
    refetchEntradas();
    refetchSalidas();
    if (hasFechas) refetchFechas();
  };

  // Refetch data cuando se actualice
  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('refreshInventario', handler);
    return () => window.removeEventListener('refreshInventario', handler);
  }, [refetch]);


  const handleApplyFilters = (filters: MovimientoFilterOptions) => {
    setAppliedFilters(filters);
  };


  const activeFiltersCount = Object.values(appliedFilters).filter(value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  }).length;

 
  const filteredMovimientos = React.useMemo(() => {
    let filtered = [...movimientos];


    // Filtro por tipo de movimiento específico 
    if (appliedFilters.tipoMovimiento && !appliedFilters.soloIngresos && !appliedFilters.soloEgresos && !hasFechas) {
      filtered = filtered.filter(mov => 
        mov.Tipo_Movimiento === appliedFilters.tipoMovimiento
      );
    }

    // Filtros secundarios que NO existen en el backend (material nombre, usuario nombre, cantidad)
    if (appliedFilters.materialNombre) {
      filtered = filtered.filter(mov => 
        mov.Material?.Nombre_Material?.toLowerCase().includes(appliedFilters.materialNombre!.toLowerCase())
      );
    }

    if (appliedFilters.usuario) {
      filtered = filtered.filter(mov => 
        mov.Usuario?.Nombre_Usuario?.toLowerCase().includes(appliedFilters.usuario!.toLowerCase())
      );
    }

    if (appliedFilters.cantidadMinima) {
      filtered = filtered.filter(mov => 
        mov.Cantidad >= appliedFilters.cantidadMinima!
      );
    }

    if (appliedFilters.cantidadMaxima) {
      filtered = filtered.filter(mov => 
        mov.Cantidad <= appliedFilters.cantidadMaxima!
      );
    }

    return filtered;
  }, [movimientos, appliedFilters]);

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
        <span className="text-sm font-medium">{getValue() || 'N/A'}</span>
      ),
      size: 200,
    }),

    columnHelper.accessor('Cantidad', {
      id: 'cantidad',
      header: 'Cantidad',
      cell: ({ getValue, row }) => {
        const cantidad = getValue();
        const unidad = row.original.Material?.Unidad_Medicion;
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion || '';
        
        return (
          <span className="text-sm">
            {cantidad?.toLocaleString()} {nombreUnidad}
          </span>
        );
      },
      size: 120,
    }),

    columnHelper.accessor('Usuario.Nombre_Usuario', {
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
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion ||  '';
        
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
        const nombreUnidad = unidad?.Nombre_Unidad_Medicion || '';
        
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
            className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            onClick={() => handleViewDetails(row.original)}
            title="Ver detalles"
          >
            Ver
          </button>
        </div>
      ),
      size: 80,
      enableSorting: false,
    }),
  ];

  const table = useReactTable({
    data: filteredMovimientos,
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
        pageSize: 5,
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
      <div className="bg-white rounded-lg p-3">
          <div className="flex items-start gap-4 flex-col justify-start">
            <h2 className="text-2xl font-bold text-gray-900">Historial de Movimientos</h2>
            <p className="text-sm text-gray-600 pb-4">Registra los movimientos de entrada y salida de materiales</p>
        </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center justify-start gap-4">
            <label htmlFor="tipo-movimiento-filter-select" className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              id="tipo-movimiento-filter-select"
              value={appliedFilters.tipoMovimiento || "todos"}
              onChange={(e) => handleApplyFilters({ ...appliedFilters, tipoMovimiento: e.target.value === "todos" ? undefined : e.target.value as TipoMovimiento })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar movimientos..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
                activeFiltersCount > 0
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <LuFilter className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-4 h-4" />
              Nuevo Movimiento
            </button>
          </div>
        </div>
      </div>
      </div>

<div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100 cursor-pointer"
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
                          <span>
                            {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                            {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-sky-50">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-sky-50 cursor-pointer transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {movimientos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No hay movimientos registrados</div>
            <div className="text-gray-400">Los movimientos de inventario aparecerán aquí</div>
          </div>
        )}


        <div className="bg-gray-50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Filas por página</span>
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
            </div>

          </div>

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
            
            <span className="text-sm text-gray-700">
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
      </div>


      {selectedMovimiento && (
        <DetailMovimientoModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          movimiento={selectedMovimiento}
        />
      )}

      <CreateMovimientoModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />

      <FilterMovimientosModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
};

export default CatalogoMovimientos;