import ResponderModal from './ResponderModal';
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
import { LuSearch, LuFilter, } from 'react-icons/lu';
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight
} from 'react-icons/md';

import { useQuejas, useQuejasArchivadas, useSugerencias, useSugerenciasArchivadas, useReportes, useReportesArchivados, useUpdateSugerenciaEstado, useUpdateQuejaEstado, useUpdateReporteEstado } from '../hook/HookContacto';
import type { Queja } from '../models/Quejas';
import type { Sugerencia } from '../models/Sugerencias';
import type { Reporte } from '../models/Reportes';
import { ESTADO_IDS, type ContactoFilterOptions, type ContactoItem, type EstadoContacto } from '../types/ContactoTypes';
import FilterContactoModal from './FilterContactoModal';
import ContactoDetailModal from './ContactoDetailModal';
import { renderTipoCell, renderPersonaCell, renderMensajeCell, renderEstadoCell, renderFechaCell, renderAccionesCell } from '../helper/Render';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
import { useAlerts } from '@/Modules/Global/context/AlertContext';




const ContactoTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContactoItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponderModalOpen, setIsResponderModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ContactoFilterOptions>({});

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const { data: quejas = [], isLoading: loadingQuejas, refetch: refetchQuejas } = useQuejas();
  const { data: sugerencias = [], isLoading: loadingSugerencias, refetch: refetchSugerencias } = useSugerencias();
  const { data: reportes = [], isLoading: loadingReportes, refetch: refetchReportes } = useReportes();
  const shouldIncludeArchived = useMemo(() => {
    const estadoArchivado = appliedFilters.estado === 'Archivado';
    const busquedaArchivado = globalFilter.trim().toLowerCase().includes('archiv');

    return estadoArchivado || busquedaArchivado;
  }, [appliedFilters.estado, globalFilter]);
  const { data: quejasArchivadas = [], isLoading: loadingQuejasArchivadas } = useQuejasArchivadas(shouldIncludeArchived);
  const { data: sugerenciasArchivadas = [], isLoading: loadingSugerenciasArchivadas } = useSugerenciasArchivadas(shouldIncludeArchived);
  const { data: reportesArchivados = [], isLoading: loadingReportesArchivados } = useReportesArchivados(shouldIncludeArchived);
  const actualizarEstadoQuejaMutation = useUpdateQuejaEstado();
  const actualizarEstadoSugerenciaMutation = useUpdateSugerenciaEstado();
  const actualizarEstadoReporteMutation = useUpdateReporteEstado();
  const { showSuccess, showError } = useAlerts();

  const { canEdit, canView } = useUserPermissions();

  const hasEditPermission = canEdit('contacto');
  const hasViewPermission = canView('contacto');

  const isLoading = loadingQuejas || loadingSugerencias || loadingReportes || loadingQuejasArchivadas || loadingSugerenciasArchivadas || loadingReportesArchivados;

  useEffect(() => {
    refetchQuejas();
    refetchSugerencias();
    refetchReportes();
  }, [refetchQuejas, refetchSugerencias, refetchReportes]);

  // Unificar todos los datos en una sola estructura
  const unifiedData = useMemo((): ContactoItem[] => {
    const data: ContactoItem[] = [];

    const mapQueja = (queja: Queja): ContactoItem => ({
      id: queja.Id_Queja,
      tipo: 'Queja',
      nombre: queja.Nombre,
      primerApellido: queja.Primer_Apellido,
      segundoApellido: queja.Segundo_Apellido,
      mensaje: queja.Descripcion,
      fechaCreacion: queja.Fecha_Queja,
      correo: queja.Correo,
      estado: queja.Estado.Estado_Queja,
      adjunto: queja.Adjunto || null,
    });

    const mapSugerencia = (sugerencia: Sugerencia): ContactoItem => ({
      id: sugerencia.Id_Sugerencia,
      tipo: 'Sugerencia',
      mensaje: sugerencia.Mensaje,
      fechaCreacion: sugerencia.Fecha_Sugerencia,
      correo: sugerencia.Correo,
      estado: sugerencia.Estado.Estado_Sugerencia,
      adjunto: sugerencia.Adjunto || null,
    });

    const mapReporte = (reporte: Reporte): ContactoItem => ({
      id: reporte.Id_Reporte,
      tipo: 'Reporte',
      nombre: reporte.Nombre,
      primerApellido: reporte.Primer_Apellido,
      segundoApellido: reporte.Segundo_Apellido,
      ubicacion: reporte.Ubicacion,
      mensaje: reporte.Descripcion || '',
      fechaCreacion: reporte.Fecha_Reporte,
      correo: reporte.Correo,
      estado: reporte.Estado.Estado_Reporte,
      adjunto: reporte.Adjunto || null,
    });

    quejas?.forEach((queja: Queja) => {
      if (queja.Estado.Estado_Queja !== 'Archivado') {
        data.push(mapQueja(queja));
      }
    });

    sugerencias?.forEach((sugerencia: Sugerencia) => {
      if (sugerencia.Estado.Estado_Sugerencia !== 'Archivado') {
        data.push(mapSugerencia(sugerencia));
      }
    });

    reportes?.forEach((reporte: Reporte) => {
      if (reporte.Estado.Estado_Reporte !== 'Archivado') {
        data.push(mapReporte(reporte));
      }
    });

    if (shouldIncludeArchived) {
      quejasArchivadas?.forEach((queja: Queja) => data.push(mapQueja(queja)));
      sugerenciasArchivadas?.forEach((sugerencia: Sugerencia) => data.push(mapSugerencia(sugerencia)));
      reportesArchivados?.forEach((reporte: Reporte) => data.push(mapReporte(reporte)));
    }

    return data.sort((a, b) => {
      const dateA = new Date(a.fechaCreacion || 0);
      const dateB = new Date(b.fechaCreacion || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [quejas, sugerencias, reportes, quejasArchivadas, sugerenciasArchivadas, reportesArchivados, shouldIncludeArchived]);

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
    const terminoBusqueda = globalFilter.trim().toLowerCase();

    if (terminoBusqueda) {
      filtered = filtered.filter((item) => {
        const nombreCompleto = [item.nombre, item.primerApellido, item.segundoApellido]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return [
          item.tipo,
          nombreCompleto,
          item.mensaje,
          item.correo,
          item.estado,
          item.ubicacion,
        ]
          .filter(Boolean)
          .some((value) => value?.toString().toLowerCase().includes(terminoBusqueda));
      });
    }

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


    return filtered;
  }, [unifiedData, appliedFilters, globalFilter]);

  const columnHelper = createColumnHelper<ContactoItem>();

  const handleArchive = async (item: ContactoItem) => {
    setSelectedItem(item);

    let nextIdEstado: number;

    const isArchived = item.estado === 'Archivado';

    if (isArchived) {
      //  Desarchivar: Volver al estado original (Contestado)
      // Si el estado actual es 'Archivado' -> vuelve a 'Contestado' (Id 2)
      nextIdEstado = ESTADO_IDS.CONTESTADO;
    } else {
      //  Archivar: Mover al estado de archivado correspondiente
      // Si el estado actual es 'Contestado' -> 'Archivado' (Id 3)
      nextIdEstado = ESTADO_IDS.ARCHIVADO;
    }

    try {
      if (item.tipo === 'Queja') {
        await actualizarEstadoQuejaMutation.mutateAsync({ id: item.id, idEstado: nextIdEstado });
      } else if (item.tipo === 'Sugerencia') {
        await actualizarEstadoSugerenciaMutation.mutateAsync({ id: item.id, idEstado: nextIdEstado });
      } else if (item.tipo === 'Reporte') {
        await actualizarEstadoReporteMutation.mutateAsync({ id: item.id, idEstado: nextIdEstado });
      }

      const isReporte = item.tipo === 'Reporte';
      const articulo = isReporte ? 'El' : 'La';
      const participio = isArchived
        ? isReporte ? 'desarchivado' : 'desarchivada'
        : isReporte ? 'archivado' : 'archivada';

      showSuccess(
        `${item.tipo} ${participio}`,
        `${articulo} ${item.tipo.toLowerCase()} se ha ${participio} exitosamente`
      );
    } catch (error) {
      console.error(`Error al ${isArchived ? 'desarchivar' : 'archivar'} ${item.tipo}:`, error);
      const accion = isArchived ? 'desarchivar' : 'archivar';
      const articulo = item.tipo === 'Reporte' ? 'el' : 'la';

      showError(
        `Error al ${accion} ${item.tipo.toLowerCase()}`,
        `No se pudo ${accion} ${articulo} ${item.tipo.toLowerCase()}. Intenta nuevamente.`
      );
    }
  };

  const columns = [
    columnHelper.display({
      id: 'tipo',
      header: 'Tipo',
      cell: ({ row }) => renderTipoCell(row.original),
      size: 130,
    }),

    columnHelper.display({
      id: 'persona',
      header: 'Persona',
      cell: ({ row }) => renderPersonaCell(row.original),
      size: 200,
    }),

    columnHelper.accessor('mensaje', {
      id: 'mensaje',
      header: 'Mensaje',
      cell: ({ getValue }) => renderMensajeCell(getValue()),
      size: 250,
    }),

    columnHelper.display({
      id: 'estado',
      header: 'Estado',
      cell: ({ row }) => renderEstadoCell(row.original),
      size: 180,
    }),

    columnHelper.accessor('fechaCreacion', {
      id: 'fecha',
      header: 'Fecha',
      cell: ({ getValue }) => renderFechaCell(getValue()),
      size: 120,
    }),

    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => renderAccionesCell(row.original, {
        actualizarEstadoQuejaMutation,
        actualizarEstadoSugerenciaMutation,
        actualizarEstadoReporteMutation,
        handleArchive,
        hasViewPermission,
        hasEditPermission,
      }),
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

  // Listen for global events dispatched by renderAccionesCell
  useEffect(() => {
    const detailListener = (e: Event) => {
      const custom = e as CustomEvent<ContactoItem>;
      if (custom?.detail) {
        handleViewDetails(custom.detail);
      }
    };
    const responderListener = (e: Event) => {
      const custom = e as CustomEvent<ContactoItem>;
      if (custom?.detail) {
        setSelectedItem(custom.detail);
        setIsResponderModalOpen(true);
      }
    };
    // NOTA: El listener 'openContactoDelete' ya no es necesario aquí, ya que el AlertDialog maneja la acción de archivar.
    window.addEventListener('openContactoDetail', detailListener as EventListener);
    window.addEventListener('openContactoResponder', responderListener as EventListener);
    return () => {
      window.removeEventListener('openContactoDetail', detailListener as EventListener);
      window.removeEventListener('openContactoResponder', responderListener as EventListener);
    };
  }, []);

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };
  const handleCloseResponderModal = () => {
    setIsResponderModalOpen(false);
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
        <div className="flex items-start gap-4 flex-col justify-start">
          <div className="flex items-start gap-4 flex-col justify-start" />
          <h2 className="text-2xl font-bold text-gray-900">Revisión de Quejas, Sugerencias y Reportes</h2>
          <p className="text-sm text-gray-600 pb-4">Gestiona y revisa las quejas, sugerencias y reportes del sistema</p>
        </div>

      </div>
      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="estado-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Estado:
            </label>
            <select
              id="estado-filter"
              value={appliedFilters.estado || ''}
              onChange={(e) => handleApplyFilters({
                ...appliedFilters,
                estado: e.target.value ? e.target.value as EstadoContacto : undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Contestado">Contestado</option>
              <option value="Archivado">Archivado</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${activeFiltersCount > 0
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

          </div>
        </div>
      </div>
      {/* Tabla */}
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
                      <span className="flex items-center gap-1">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                        {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-sky-50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-sky-50 cursor-pointer transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                    {globalFilter
                      ? 'No se encontraron quejas, sugerencias o reportes que coincidan con la búsqueda'
                      : 'No hay registros de quejas, sugerencias o reportes'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className='text-sm text-gray-700'>Filas por página</span>
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

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Primera página"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
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
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página siguiente"
            >
              <MdKeyboardArrowRight />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>


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
      {selectedItem && (
        <ResponderModal
          isOpen={isResponderModalOpen}
          onClose={handleCloseResponderModal}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default ContactoTable;