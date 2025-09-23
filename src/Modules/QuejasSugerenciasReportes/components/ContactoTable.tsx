// src/Modules/QuejasSugerenciasReportes/components/ContactoTable.tsx
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
import { 
  LuSearch, 
  LuChevronLeft, 
  LuChevronRight, 
  LuFileText,
  LuTriangle,
  LuLightbulb,
  LuCalendar,
  LuUser,
  LuPlus
} from 'react-icons/lu';

import type { Queja } from '../models/Quejas';
import type { Sugerencia } from '../models/Sugerencias';
import type { Reporte } from '../models/Reportes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuejas, useSugerencias, useReportes } from '../hook/HookContacto';
import ContactoDetailModal from './ContactoDetailModal';

// Tipo unificado para la tabla
export interface ContactoItem {
  id: number;
  tipo: 'Queja' | 'Sugerencia' | 'Reporte';
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  ubicacion?: string;
  mensaje: string;
  fechaCreacion: Date | string | null;
  estado?: 'Pendiente' | 'En Proceso' | 'Resuelto';
  adjunto?: File | null;
}

type FilterType = 'todos' | 'quejas' | 'sugerencias' | 'reportes';
type EstadoFilter = 'todos' | 'Pendiente' | 'En Proceso' | 'Resuelto';

const ContactoTable = () => {
  const { data: quejas = [], isLoading: loadingQuejas } = useQuejas();
  const { data: sugerencias = [], isLoading: loadingSugerencias } = useSugerencias();
  const { data: reportes = [], isLoading: loadingReportes } = useReportes();

  const [globalFilter, setGlobalFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState<FilterType>('todos');
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todos');
  const [selectedItem, setSelectedItem] = useState<ContactoItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const isLoading = loadingQuejas || loadingSugerencias || loadingReportes;

  // Unificar todos los datos en una sola estructura
  const unifiedData = useMemo((): ContactoItem[] => {
    const data: ContactoItem[] = [];

    // Agregar quejas
    quejas?.forEach((queja: Queja) => {
      data.push({
        ...queja,
        tipo: 'Queja',
      });
    });

    // Agregar sugerencias
    sugerencias?.forEach((sugerencia: Sugerencia) => {
      data.push({
        ...sugerencia,
        tipo: 'Sugerencia',
        nombre: undefined, 
        primerApellido: undefined,
        segundoApellido: undefined,
        ubicacion: undefined,
      });
    });

    // Agregar reportes
    reportes?.forEach((reporte: Reporte) => {
      data.push({
        ...reporte,
        tipo: 'Reporte',
      });
    });

    return data.sort((a, b) => {
      const dateA = new Date(a.fechaCreacion || 0);
      const dateB = new Date(b.fechaCreacion || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [quejas, sugerencias, reportes]);

  // Filtrar datos
  const filteredData = useMemo(() => {
    let filtered = unifiedData;

    if (tipoFilter !== 'todos') {
      const tipoMap = {
        'quejas': 'Queja',
        'sugerencias': 'Sugerencia',
        'reportes': 'Reporte'
      };
      filtered = filtered.filter(item => item.tipo === tipoMap[tipoFilter]);
    }

    if (estadoFilter !== 'todos') {
      filtered = filtered.filter(item => 
        item.tipo !== 'Reporte' || item.estado === estadoFilter
      );
    }

    return filtered;
  }, [unifiedData, tipoFilter, estadoFilter]);

  const columnHelper = createColumnHelper<ContactoItem>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('tipo', {
        header: 'Tipo',
        cell: info => {
          const tipo = info.getValue();
          const config = {
            'Queja': { icon: LuTriangle, color: 'text-red-600 bg-red-50', text: 'Queja' },
            'Sugerencia': { icon: LuLightbulb, color: 'text-yellow-600 bg-yellow-50', text: 'Sugerencia' },
            'Reporte': { icon: LuFileText, color: 'text-blue-600 bg-blue-50', text: 'Reporte' }
          }[tipo];
          
          const IconComponent = config.icon;
          
          return (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              <IconComponent className="w-3 h-3" />
              {config.text}
            </div>
          );
        },
      }),
      columnHelper.accessor(row => `${row.nombre || ''} ${row.primerApellido || ''} ${row.segundoApellido || ''}`.trim(), {
        id: 'nombreCompleto',
        header: 'Persona',
        cell: info => {
          const value = info.getValue();
          return value || (
            <span className="text-gray-400 italic text-sm flex items-center gap-1">
              <LuUser className="w-3 h-3" />
              Anónimo
            </span>
          );
        },
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: info => {
          const estado = info.getValue();
          const tipo = info.row.original.tipo;
          
          if (tipo !== 'Reporte' || !estado) {
            return <span className="text-gray-400 text-sm">-</span>;
          }

          const config = {
            'Pendiente': 'bg-yellow-100 text-yellow-800',
            'En Proceso': 'bg-blue-100 text-blue-800',
            'Resuelto': 'bg-green-100 text-green-800'
          }[estado];

          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config}`}>
              {estado}
            </span>
          );
        },
      }),
      columnHelper.accessor('fechaCreacion', {
        header: 'Fecha',
        cell: info => {
          const fecha = info.getValue();
          if (!fecha) return <span className="text-gray-400">-</span>;
          
          try {
            const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
            return (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <LuCalendar className="w-3 h-3" />
                {format(fechaObj, 'dd/MM/yyyy', { locale: es })}
              </div>
            );
          } catch {
            return <span className="text-gray-400">-</span>;
          }
        },
      }),
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

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
  });

  const handleRowClick = (item: ContactoItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

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
        {/* Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Quejas, Sugerencias y Reportes
            </h2>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <LuPlus className="w-4 h-4" />
              Nuevo
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-3">
              <select
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value as FilterType)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los tipos</option>
                <option value="quejas">Solo Quejas</option>
                <option value="sugerencias">Solo Sugerencias</option>
                <option value="reportes">Solo Reportes</option>
              </select>

              {(tipoFilter === 'reportes' || tipoFilter === 'todos') && (
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value as EstadoFilter)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              )}
            </div>
          </div>

          {/* Filtros activos */}
          {(tipoFilter !== 'todos' || estadoFilter !== 'todos') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tipoFilter !== 'todos' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tipo: {tipoFilter}
                  <button
                    onClick={() => setTipoFilter('todos')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {estadoFilter !== 'todos' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Estado: {estadoFilter}
                  <button
                    onClick={() => setEstadoFilter('todos')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setTipoFilter('todos');
                  setEstadoFilter('todos');
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Tabla */}
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

        {/* Paginación */}
        {table.getPageCount() > 1 && (
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
                  className="px-2 py-1 border border-gray-400 rounded-lg bg-white shadow min-w-[70px] text-sm"
                >
                  {[5, 10, 20, 50].map(size => (
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
              >
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetailModal && selectedItem && (
          <ContactoDetailModal
            item={selectedItem}
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ContactoTable;