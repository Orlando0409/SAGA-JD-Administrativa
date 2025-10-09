// src/Modules/QuejasSugerenciasReportes/components/ContactoTable.tsx
import { useState, useEffect, useMemo } from 'react';
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
  LuChevronUp, 
  LuChevronDown,
  LuCalendar,
  LuUser,
  LuFileText,
  LuLightbulb,
  LuTriangle,
  LuFilter,
  LuPlus,
  LuPaperclip
} from 'react-icons/lu';
import { 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight, 
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight 
} from "react-icons/md";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuejas, useSugerencias, useReportes } from '../hook/HookContacto';
import type { Queja } from '../models/Quejas';
import type { Sugerencia } from '../models/Sugerencias';
import type { Reporte } from '../models/Reportes';
import type { ContactoFilterOptions, TipoContacto } from '../types/ContactoTypes';
import FilterContactoModal from './FilterContactoModal';
import ContactoDetailModal from './ContactoDetailModal';
import CreateContactoModal from './CreateContactoModal';

// Tipo unificado para la tabla
export interface ContactoItem {
  id: number;
  tipo: TipoContacto;
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  ubicacion?: string;
  mensaje: string;
  fechaCreacion: Date | string | null;
  estado?: 'Pendiente' | 'En Proceso' | 'Resuelto';
  adjunto?: File | null;
}

const ContactoTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContactoItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ContactoFilterOptions>({});

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const { data: quejas = [], isLoading: loadingQuejas, refetch: refetchQuejas } = useQuejas();
  const { data: sugerencias = [], isLoading: loadingSugerencias, refetch: refetchSugerencias } = useSugerencias();
  const { data: reportes = [], isLoading: loadingReportes, refetch: refetchReportes } = useReportes();

  const isLoading = loadingQuejas || loadingSugerencias || loadingReportes;

  // Refetch data cuando se monte el componente
  useEffect(() => {
    refetchQuejas();
    refetchSugerencias();
    refetchReportes();
  }, [refetchQuejas, refetchSugerencias, refetchReportes]);

  // Unificar todos los datos en una sola estructura
  const unifiedData = useMemo((): ContactoItem[] => {
    const data: ContactoItem[] = [];

    // Agregar quejas
    quejas?.forEach((queja: Queja) => {
      data.push({
        id: queja.id,
        tipo: 'Queja',
        nombre: queja.nombre,
        primerApellido: queja.primerApellido,
        segundoApellido: queja.segundoApellido,
        mensaje: queja.mensaje,
        fechaCreacion: queja.fechaCreacion,
        adjunto: queja.adjunto,
      });
    });

    // Agregar sugerencias
    sugerencias?.forEach((sugerencia: Sugerencia) => {
      data.push({
        id: sugerencia.id,
        tipo: 'Sugerencia',
        mensaje: sugerencia.mensaje,
        fechaCreacion: sugerencia.fechaCreacion,
        adjunto: sugerencia.adjunto,
      });
    });

    // Agregar reportes
    reportes?.forEach((reporte: Reporte) => {
      data.push({
        id: reporte.id,
        tipo: 'Reporte',
        nombre: reporte.nombre,
        primerApellido: reporte.primerApellido,
        segundoApellido: reporte.segundoApellido,
        ubicacion: reporte.ubicacion,
        mensaje: reporte.mensaje,
        fechaCreacion: reporte.fechaCreacion,
        estado: reporte.estado,
        adjunto: reporte.adjunto,
      });
    });

    return data.sort((a, b) => {
      const dateA = new Date(a.fechaCreacion || 0);
      const dateB = new Date(b.fechaCreacion || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [quejas, sugerencias, reportes]);

  const handleApplyFilters = (filters: ContactoFilterOptions) => {
    setAppliedFilters(filters);
  };

  const activeFiltersCount = Object.values(appliedFilters).filter(value => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return value > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  }).length;

  // Aplicar filtros avanzados
  const filteredData = useMemo(() => {
    let filtered = [...unifiedData];

    // Filtrar por tipo (desde el filtro inline)
    if (appliedFilters.tipo) {
      filtered = filtered.filter(item => item.tipo === appliedFilters.tipo);
    }

    // Filtrar por estado
    if (appliedFilters.estado) {
      filtered = filtered.filter(item => item.estado === appliedFilters.estado);
    }

    // Filtrar por fecha inicio
    if (appliedFilters.fechaInicio) {
      filtered = filtered.filter(item => {
        const fechaItem = new Date(item.fechaCreacion || 0);
        const fechaInicio = new Date(appliedFilters.fechaInicio!);
        return fechaItem >= fechaInicio;
      });
    }

    // Filtrar por fecha fin
    if (appliedFilters.fechaFin) {
      filtered = filtered.filter(item => {
        const fechaItem = new Date(item.fechaCreacion || 0);
        const fechaFin = new Date(appliedFilters.fechaFin!);
        return fechaItem <= fechaFin;
      });
    }

    // Filtrar por adjuntos
    if (appliedFilters.conAdjunto) {
      filtered = filtered.filter(item => item.adjunto !== null && item.adjunto !== undefined);
    }

    // Filtrar solo con nombre
    if (appliedFilters.soloConNombre) {
      filtered = filtered.filter(item => 
        item.nombre && item.nombre.trim().length > 0
      );
    }

    // Filtrar solo sin nombre (anónimos)
    if (appliedFilters.soloSinNombre) {
      filtered = filtered.filter(item => 
        !item.nombre || item.nombre.trim().length === 0
      );
    }

    return filtered;
  }, [unifiedData, appliedFilters]);

  const columnHelper = createColumnHelper<ContactoItem>();

  const columns = [
    columnHelper.display({
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => {
        const item = row.original;
        let icon;
        let colorClass;

        switch (item.tipo) {
          case 'Queja':
            icon = <LuTriangle className="text-red-600" size={16} />;
            colorClass = 'text-red-700';
            break;
          case 'Sugerencia':
            icon = <LuLightbulb className="text-yellow-600" size={16} />;
            colorClass = 'text-yellow-700';
            break;
          case 'Reporte':
            icon = <LuFileText className="text-blue-600" size={16} />;
            colorClass = 'text-blue-700';
            break;
        }

        return (
          <div className="flex items-center gap-2">
            {icon}
            <span className={`text-sm font-medium ${colorClass}`}>
              {item.tipo}
            </span>
          </div>
        );
      },
      size: 130,
    }),

    columnHelper.display({
      id: 'identificacion',
      header: 'Identificación',
      cell: ({ row }) => {
        const item = row.original;
        const nombreCompleto = [item.nombre, item.primerApellido, item.segundoApellido]
          .filter(Boolean)
          .join(' ');

        return (
          <div className="flex items-center gap-2">
            <LuUser className="text-gray-400" size={14} />
            <span className="text-sm">
              {nombreCompleto || <span className="text-gray-400 italic">Anónimo</span>}
            </span>
          </div>
        );
      },
      size: 200,
    }),

    columnHelper.accessor('mensaje', {
      id: 'mensaje',
      header: 'Mensaje',
      cell: ({ getValue }) => {
        const mensaje = getValue();
        const truncated = mensaje.length > 60 ? mensaje.substring(0, 60) + '...' : mensaje;
        
        return (
          <span className="text-sm text-gray-700" title={mensaje}>
            {truncated}
          </span>
        );
      },
      size: 300,
    }),

    columnHelper.display({
      id: 'ubicacion',
      header: 'Ubicación',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span className="text-sm text-gray-600">
            {item.ubicacion || <span className="text-gray-400">-</span>}
          </span>
        );
      },
      size: 150,
    }),

    columnHelper.display({
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => {
        const item = row.original;
        
        if (item.tipo !== 'Reporte' || !item.estado) {
          return <span className="text-gray-400 text-sm">-</span>;
        }

        let badgeClass = '';
        switch (item.estado) {
          case 'Pendiente':
            badgeClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'En Proceso':
            badgeClass = 'bg-blue-100 text-blue-800';
            break;
          case 'Resuelto':
            badgeClass = 'bg-green-100 text-green-800';
            break;
        }

        return (
          <span className={`px-2 py-1 text-xs rounded-full ${badgeClass}`}>
            {item.estado}
          </span>
        );
      },
      size: 130,
    }),

    columnHelper.accessor('fechaCreacion', {
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
              {format(fechaObj, 'dd/MM/yyyy', { locale: es })}
            </span>
          </div>
        );
      },
      size: 120,
    }),

    columnHelper.display({
      id: 'adjunto',
      header: 'Adjunto',
      cell: ({ row }) => {
        const item = row.original;
        
        return (
          <div className="flex items-center justify-center">
            {item.adjunto ? (
              <LuPaperclip className="text-blue-600" size={16} title="Tiene adjunto" />
            ) : (
              <span className="text-gray-300">-</span>
            )}
          </div>
        );
      },
      size: 80,
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
    data: filteredData,
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

  const handleViewDetails = (item: ContactoItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quejas, Sugerencias y Reportes</h2>
          <p className="text-sm text-gray-600 mt-1">Gestión de contacto con usuarios</p>
        </div>
      </div>

      {/* Controles de filtro y búsqueda */}
      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="tipo-contacto-filter-select" className="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              id="tipo-contacto-filter-select"
              value={appliedFilters.tipo || "todos"}
              onChange={(e) => handleApplyFilters({ 
                ...appliedFilters, 
                tipo: e.target.value === "todos" ? undefined : e.target.value as TipoContacto 
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="todos">Todos los tipos</option>
              <option value="Queja">Quejas</option>
              <option value="Sugerencia">Sugerencias</option>
              <option value="Reporte">Reportes</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, mensaje..."
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
              Nuevo
            </button>
          </div>
        </div>
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

        {/* Paginación */}
        <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6 gap-4">
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

        {unifiedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No hay registros</div>
            <div className="text-gray-400">Las quejas, sugerencias y reportes aparecerán aquí</div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateContactoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <FilterContactoModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {selectedItem && (
        <ContactoDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default ContactoTable;