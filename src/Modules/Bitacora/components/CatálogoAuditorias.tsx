import { useState, useMemo } from 'react';
import { LuSearch, LuFilter } from 'react-icons/lu';
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
    MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { useGetAllAuditorias } from '../hook/HookAuditoria';
import type { Auditoria } from '../models/Auditoria';
import type { AuditoriaFilterOptions } from '../types/AuditoriaTypes';
import DetailAuditoriaModal from './DetailAuditoriaModal';
import FilterAuditoriaModal from './FilterAuditoriaModal';

const columnHelper = createColumnHelper<Auditoria>();

const pageSizeOptions = [5, 10, 15, 25, 50];

const CatálogoAuditorias = () => {
  const { data: auditorias = [], isLoading } = useGetAllAuditorias();

  const [globalFilter, setGlobalFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState<Auditoria | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<AuditoriaFilterOptions>(
    {}
  );
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const handleViewDetail = (auditoria: Auditoria) => {
    setSelectedAuditoria(auditoria);
    setShowDetailModal(true);
  };

  const handleApplyFilters = (filters: AuditoriaFilterOptions) => {
    setAppliedFilters(filters);
    // Reinicia la página al aplicar nuevos filtros
    table.setPageIndex(0);
  };

  const clearFilters = () => {
    setAppliedFilters({});
    table.setPageIndex(0);
  };

  // Filtrado de datos
  const filteredData = useMemo(() => {
    let filtered = auditorias;

    // Filtro por módulo
    if (appliedFilters.modulo) {
      filtered = filtered.filter(
        (auditoria) => auditoria.Modulo === appliedFilters.modulo
      );
    }

    // Filtro por acción
    if (appliedFilters.accion) {
      filtered = filtered.filter(
        (auditoria) => auditoria.Accion === appliedFilters.accion
      );
    }


    return filtered;
  }, [auditorias, appliedFilters]);

  // Definición de columnas (mantenido igual)
  const columns = [
    columnHelper.accessor('Modulo', {
      header: 'Módulo',
      cell: (info) => (
        <span className="font-medium text-gray-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('Accion', {
      header: 'Acción',
      cell: (info) => {
        const accion = info.getValue();
        const getAccionColor = (acc: string) => {
          switch (acc) {
            case 'Creación':
              return 'bg-green-100 text-green-800 border-green-200';
            case 'Actualización':
              return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Eliminación':
              return 'bg-red-100 text-red-800 border-red-200';
            default:
              return 'bg-gray-100 text-gray-800 border-gray-200';
          }
        };
        return (
          <div className="flex justify-start">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getAccionColor(
                accion
              )}`}
            >
              {accion}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('Nombre_Registro', {
      header: 'Registro Afectado',
      cell: (info) => (
        <div className="flex justify-between">
          <span className="font-medium text-sm ">
            {info.getValue() || <span className="text-gray-400">-</span>}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('Usuario', {
      header: 'Usuario',
      cell: (info) => {
        const usuario = info.getValue();
        return (
          <div className="flex justify-start">
            <span className="font-medium text-gray-900 text-sm">
              {usuario?.Nombre_Usuario || 'Desconocido'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.accessor('Fecha_Accion', {
      header: 'Fecha y Hora',
      cell: (info) => {
        const fecha = info.getValue();
        if (!fecha) return <span className="text-gray-400">-</span>;
        const date = new Date(fecha);
        return (
          <div className="flex items-start gap-2 justify-start text-xs">
            <span className="text-gray-900 font-medium">
              {date.toLocaleDateString('es-CR')}
            </span>
            <span className="font-medium text-gray-500">
              {date.toLocaleTimeString('es-CR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Acciones',
      cell: (info) => (
        <div className="flex justify-center">
        <button
          onClick={() => handleViewDetail(info.row.original)}
          className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
          title="Ver Detalle"
        >
          Ver
        </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
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
        pageIndex: 0,
      },
    },
  });


  const hasActiveFilters =
    appliedFilters.modulo ||
    appliedFilters.accion ||
    appliedFilters.fechaInicio ||
    appliedFilters.fechaFin;



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando auditorías...</span>
      </div>
    );
  }
  const renderAuditoriasView = () => (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Auditoría del Sistema
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Registro de todas las acciones realizadas en el sistema
          </p>
        </div>
        {/* Aquí podrías añadir un botón de exportar si fuera necesario */}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-end gap-4">
        <div className="relative flex-1 max-w-lg">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por módulo, acción, registro o usuario..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowFilterModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              hasActiveFilters
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LuFilter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-white text-sky-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {Object.values(appliedFilters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

<div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                  {headerGroup.headers.map((header, index) => (
                    <th key={header.id} className={`px-2 sm:px-4 py-3 font-medium border-b border-sky-100 ${
                      index === 0 ? 'text-left' : 'text-center'
                    }`}>
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
                    {globalFilter ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No hay categorías registradas'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-sky-50 cursor-pointer transition-colors">
                    {row.getVisibleCells().map((cell, index) => {
                      let cellContent: React.ReactNode;
                      
                      if (cell.column.columnDef.cell) {
                        if (typeof cell.column.columnDef.cell === 'function') {
                          cellContent = cell.column.columnDef.cell(cell.getContext());
                        } else {
                          cellContent = cell.column.columnDef.cell;
                        }
                      } else {
                        cellContent = cell.getValue() as React.ReactNode;
                      }
                      
                      return (
                        <td key={cell.id} className={`px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top ${
                          index === 0 ? 'text-left' : 'text-center'
                        }`}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

  
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Filas por página:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {pageSizeOptions.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Primera página"
              >
                <MdKeyboardDoubleArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <MdKeyboardArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Última página"
              >
                <MdKeyboardDoubleArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailAuditoriaModal
        auditoria={selectedAuditoria}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedAuditoria(null);
        }}
      />

      <FilterAuditoriaModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );

  return renderAuditoriasView();
};

export default CatálogoAuditorias;