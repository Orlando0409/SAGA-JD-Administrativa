import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { 
  LuPlus, 
  LuFilter, 
  LuSearch, 
  LuArrowUp,
  LuArrowDown
} from 'react-icons/lu';
import { 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";

import type { MovimientoMaterial } from '../../models/MovimientoMaterial';
import type { MovimientoFilterOptions } from '../../types/MovimientosTypes';

// Modales
import CreateMovimientoModal from './CreateMovimientoModal';
import FilterMovimientosModal from './FilterMovimientosModal';
import DetailMovimientoModal from './DetailMovimientoModal';
import { da } from 'date-fns/locale';

const MovimientosManagement = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMovimiento, setSelectedMovimiento] = useState<MovimientoMaterial | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MovimientoFilterOptions>({});
  const  movimientos:any  = []; // Reemplazar con el hook de datos real

  // Configuración de columnas
  const columnHelper = createColumnHelper<MovimientoMaterial>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('Fecha_Movimiento', {
        header: 'Fecha',
        cell: info => (
          <div className="text-sm">
            {new Date(info.getValue()).toLocaleDateString('es-CR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        ),
      }),
      columnHelper.accessor('Material', {
        header: 'Material',
        cell: info => {
          const material = info.getValue();
          return (
            <div>
              <div className="font-medium text-gray-900">
                {material?.Nombre_Material || 'Material no disponible'}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('Tipo_Movimiento', {
        header: 'Tipo',
        cell: info => {
          const tipo = info.getValue();
          const isIngreso = tipo === 'INGRESO';
          return (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isIngreso 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isIngreso ? <LuArrowUp className="w-3 h-3" /> : <LuArrowDown className="w-3 h-3" />}
              {tipo}
            </div>
          );
        },
      }),
      columnHelper.accessor('Cantidad', {
        header: 'Cantidad',
        cell: info => (
          <div className="font-medium">
            {info.getValue().toLocaleString('es-CR')}
          </div>
        ),
      }),
      columnHelper.accessor('Cantidad_Anterior', {
        header: 'Stock Anterior',
        cell: info => (
          <div className="text-gray-600">
            {info.getValue().toLocaleString('es-CR')}
          </div>
        ),
      }),
      columnHelper.accessor('Cantidad_Nueva', {
        header: 'Stock Nuevo',
        cell: info => (
          <div className="font-medium text-blue-600">
            {info.getValue().toLocaleString('es-CR')}
          </div>
        ),
      }),
      columnHelper.accessor('Usuario', {
        header: 'Usuario',
        cell: info => (
          <div className="text-sm text-gray-600">
            {info.getValue() || 'Sistema'}
          </div>
        ),
      }),
      columnHelper.accessor('Motivo', {
        header: 'Motivo',
        cell: info => (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {info.getValue() || 'Sin especificar'}
          </div>
        ),
      }),
    ],
    []
  );


  // Configuración de la tabla
  const table = useReactTable({
    data: movimientos as MovimientoMaterial[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });


  const handleRowClick = (movimiento: MovimientoMaterial) => {
    setSelectedMovimiento(movimiento);
    setShowDetailModal(true);
  };

  const activeFiltersCount = Object.values(appliedFilters).filter(v => 
    v !== undefined && v !== '' && v !== false
  ).length;



  return (
    <div className="space-y-6">

      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar movimientos..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterModal(true)}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <LuPlus className="w-4 h-4" />
            Nuevo Movimiento
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-2' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header(header.getContext())
                              : header.column.columnDef.header}
                            {{
                              asc: <MdKeyboardArrowUp />,
                              desc: <MdKeyboardArrowDown />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue() as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Mostrar</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>de {table.getFilteredRowModel().rows.length} resultados</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardArrowLeft />
            </button>
            <span className="px-2 py-1 text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardArrowRight />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <CreateMovimientoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <FilterMovimientosModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={setAppliedFilters}
        currentFilters={appliedFilters}
      />

      {selectedMovimiento && (
        <DetailMovimientoModal
          movimiento={selectedMovimiento}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMovimiento(null);
          }}
        />
      )}
    </div>
  );
};

export default MovimientosManagement;