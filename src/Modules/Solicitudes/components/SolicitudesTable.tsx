import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    createColumnHelper,
    type ColumnDef,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { User, Building } from 'lucide-react';

// Importar hooks de solicitudes
import { useSolicitudesFisicas } from '../Hooks/HookSolicitudesFisicas';
import { useSolicitudesJuridicas } from '../Hooks/HookSolicitudesJuridicas';

// Importar tipos
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';

// Importar modal de edición
import EditSolicitudModal from './EditSolicitudModal';
import ModalSolicitud from './ModalSolicitud';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useEnRevisionSolicitudAfiliacion } from '../Hooks/Fisico Update/HookAfiliadoFisico';

// Tipo unificado para la tabla de solicitudes
type SolicitudUnificada = {
    id: string; // ID interno generado
    Id: number;
    Nombre_Completo: string;
    Cedula_Documento: string;
    Tipo_Solicitud: 'Afiliacion' | 'Desconexion' | 'Cambio de Medidor' | 'Asociado';
    Estado: {
        Id_Estado: number;
        Nombre_Estado: string;
    };
    Tipo_Persona: 'Físico' | 'Jurídico';
    Fecha_Creacion: string;
    // Datos originales para acciones
    datos_originales: SolicitudFisica | SolicitudJuridica;

};

export default function SolicitudesTable() {
    // Hooks para ambos tipos de solicitudes
    const { data: solicitudesFisicas, isLoading: loadingFisicas, isError: errorFisicos } = useSolicitudesFisicas();
    const { data: solicitudesJuridicas, isLoading: loadingJuridicas, isError: errorJuridicos } = useSolicitudesJuridicas();
    const marcarEnRevisionMutation = useEnRevisionSolicitudAfiliacion();

    // Debug INMEDIATO al cargar el componente

    const [globalFilter, setGlobalFilter] = useState('');

    // Estados para el modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSolicitud, setSelectedSolicitud] = useState<{
        tipo: 'solicitud-fisica' | 'solicitud-juridica';
        datos: SolicitudFisica | SolicitudJuridica;
    } | null>(null);

    // Estados para el modal de gestión de solicitudes (aprobar/rechazar)
    const [showGestionModal, setShowGestionModal] = useState(false);
    const [selectedSolicitudForGestion, setSelectedSolicitudForGestion] = useState<{
        tipo: 'solicitud-fisica' | 'solicitud-juridica';
        datos: SolicitudFisica | SolicitudJuridica;
    } | null>(null);

    // Estados combinados
    const isLoading = loadingFisicas || loadingJuridicas;
    const isError = errorFisicos || errorJuridicos;

    // Estado para la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });
    // Opciones de tamaño de página para la paginación
    const pageSizeOptions = [5, 10, 20, 50];
    // Función para unificar los datos de solicitudes
    const datosUnificados = useMemo((): SolicitudUnificada[] => {





        // Validar que los datos sean arrays
        const solicitudesFisicasArray = Array.isArray(solicitudesFisicas) ? solicitudesFisicas : [];
        const solicitudesJuridicasArray = Array.isArray(solicitudesJuridicas) ? solicitudesJuridicas : [];



        // Solicitudes Físicas
        const solicitudesFisicasUnificadas: SolicitudUnificada[] = solicitudesFisicasArray.map((solicitud: SolicitudFisica, index: number) => {


            // Buscar ID real en la solicitud (backend usa Id_Solicitud)
            const solicitudConId = solicitud as any;
            const idReal = solicitudConId.Id_Solicitud || solicitudConId.id || solicitudConId.Id || solicitudConId.ID;

            return {
                id: `fisico-${index}`, // ID interno único para la tabla
                Id: idReal || (index + 1), // Usar ID real del backend o secuencial como fallback
                Nombre_Completo: `${solicitud.Nombre || ''} ${solicitud.Apellido1 || ''} ${solicitud.Apellido2 || ''}`.trim() || 'Sin nombre',
                Cedula_Documento: solicitud.Identificacion || 'Sin identificación',
                Tipo_Solicitud: solicitud.Tipo_Solicitud,
                Estado: {
                    Id_Estado: solicitud.Estado?.Id_Estado_Solicitud || 0,
                    Nombre_Estado: solicitud.Estado?.Nombre_Estado || 'Sin estado'
                },
                Tipo_Persona: 'Físico' as const,
                Fecha_Creacion: solicitud.Fecha_Creacion || '',
                datos_originales: solicitud
            };
        });

        // Solicitudes Jurídicas
        const solicitudesJuridicasUnificadas: SolicitudUnificada[] = solicitudesJuridicasArray.map((solicitud: SolicitudJuridica, index: number) => {

            // Buscar ID real en la solicitud (backend usa Id_Solicitud)
            const solicitudConId = solicitud as any;
            const idReal = solicitudConId.Id_Solicitud || solicitudConId.id || solicitudConId.Id || solicitudConId.ID;

            return {
                id: `juridico-${index}`, // ID interno único para la tabla
                Id: idReal || (solicitudesFisicasUnificadas.length + index + 1), // Usar ID real del backend o continuar secuencia
                Nombre_Completo: solicitud.Razon_Social || 'Sin razón social',
                Cedula_Documento: solicitud.Cedula_Juridica || 'Sin cédula jurídica',
                Tipo_Solicitud: solicitud.Tipo_Solicitud,
                Estado: {
                    Id_Estado: solicitud.Estado?.Id_Estado_Solicitud || 0,
                    Nombre_Estado: solicitud.Estado?.Nombre_Estado || 'Sin estado'
                },
                Tipo_Persona: 'Jurídico' as const,
                Fecha_Creacion: solicitud.Fecha_Creacion || '',
                datos_originales: solicitud
            };
        });

        const resultado = [
            ...solicitudesFisicasUnificadas,
            ...solicitudesJuridicasUnificadas
        ].sort((a, b) => a.Id - b.Id);

        console.log(' Datos unificados finales:', resultado);
        console.log(' IDs finales en la tabla:', resultado.map(s => ({ Id: s.Id, Cedula: s.Cedula_Documento, Tipo: s.Tipo_Persona })));
        return resultado;
    }, [solicitudesFisicas, solicitudesJuridicas]);

    // Función para abrir el modal de gestión (aprobar/rechazar)
    const handleViewDetail = (solicitud: SolicitudUnificada) => {
        // Determinar el tipo según Tipo_Persona
        const tipo = solicitud.Tipo_Persona === 'Físico' ? 'solicitud-fisica' : 'solicitud-juridica';

        setSelectedSolicitudForGestion({
            tipo: tipo,
            datos: solicitud.datos_originales
        });
        setShowGestionModal(true);
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return datosUnificados;
        const q = globalFilter.toLowerCase();
        return datosUnificados.filter((solicitud) =>
            [
                solicitud.Nombre_Completo,
                solicitud.Cedula_Documento,
                solicitud.Tipo_Solicitud,
                solicitud.Estado.Nombre_Estado,
                solicitud.Tipo_Persona
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [datosUnificados, globalFilter]);

    const columnHelper = createColumnHelper<SolicitudUnificada>();
    const columns: ColumnDef<SolicitudUnificada, any>[] = [
        columnHelper.accessor('Nombre_Completo', {
            header: 'Nombre / Razón Social',
            cell: (info) => {
                const fila = info.row.original;

                if (fila.Tipo_Persona === 'Físico') {
                    const datosOriginales = fila.datos_originales as SolicitudFisica;
                    console.log('Datos físico en celda:', datosOriginales);

                    if (!datosOriginales.Nombre && !datosOriginales.Apellido1) {
                        return 'Datos no disponibles';
                    }

                    const nombreCompleto = `${datosOriginales.Nombre || ''} ${datosOriginales.Apellido1 || ''} ${datosOriginales.Apellido2 || ''}`.trim();
                    return nombreCompleto || 'Sin nombre';
                } else {
                    const datosOriginales = fila.datos_originales as SolicitudJuridica;
                    console.log('Datos jurídico en celda:', datosOriginales);

                    return datosOriginales.Razon_Social || 'Sin razón social';
                }
            }
        }),
        columnHelper.accessor('Cedula_Documento', {
            header: 'Número Identificación / Cédula Jurídica', // <-- CAMBIO: Nuevo encabezado
            cell: (info) => {
                const fila = info.row.original;
                if (fila.Tipo_Persona === 'Físico') {
                    const datosOriginales = fila.datos_originales as SolicitudFisica;
                    return datosOriginales.Identificacion || 'Sin número de identificación'; // <-- CAMBIO: usa Identificacion
                } else {
                    const datosOriginales = fila.datos_originales as SolicitudJuridica;
                    return datosOriginales.Cedula_Juridica || 'Sin cédula jurídica';
                }
            },
            size: 160
        }),
        columnHelper.accessor('Tipo_Solicitud', {
            header: 'Tipo de Solicitud',
            cell: (info) => {
                const tipo = info.getValue();
                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';

                if (tipo === 'Afiliacion') {
                    return <span className={`${base} bg-emerald-100 text-emerald-700`}> Afiliación</span>;
                } else if (tipo === 'Desconexion') {
                    return <span className={`${base} bg-red-100 text-red-700`}> Desconexión</span>;
                } else if (tipo === 'Cambio de Medidor') {
                    return <span className={`${base} bg-blue-100 text-blue-700`}> Cambio Medidor</span>;
                } else if (tipo === 'Asociado') {
                    return <span className={`${base} bg-orange-100 text-orange-700`}> Asociado</span>;
                }

                return <span className={`${base} bg-slate-100 text-slate-700`}>{tipo}</span>;
            },
            size: 150,
        }),
        columnHelper.accessor('Estado', {
            header: 'Estado',
            cell: (info) => {
                const estado = info.getValue();
                const estadoNombre = estado?.Nombre_Estado || 'Sin estado';

                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';

                if (estadoNombre === 'Pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700`}> Pendiente</span>;
                } else if (estadoNombre === 'Aprobada' || estadoNombre === 'Aprobado') {
                    return <span className={`${base} bg-green-100 text-green-700`}> Aprobada</span>;
                } else if (estadoNombre === 'Rechazada' || estadoNombre === 'Rechazado') {
                    return <span className={`${base} bg-red-100 text-red-700`}>Rechazada</span>;
                } else if (estadoNombre === 'En Proceso') {
                    return <span className={`${base} bg-blue-100 text-blue-700`}> En Proceso</span>;
                }

                return <span className={`${base} bg-slate-100 text-slate-700`}>{estadoNombre}</span>;
            },
            size: 120,
        }),
        columnHelper.accessor('Tipo_Persona', {
            header: 'Tipo Persona',
            cell: (info) => {
                const tipo = info.getValue();
                return (
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${tipo === 'Físico'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                        }`}>
                        {tipo === 'Físico' ? <User size={14} /> : <Building size={14} />} {tipo}
                    </span>
                );
            },
            size: 120,
        }),
        columnHelper.accessor('Fecha_Creacion', {
            header: 'Fecha Creación',
            cell: (info) => {
                const fecha = info.getValue();
                if (!fecha) return 'Sin fecha';

                try {
                    const fechaObj = new Date(fecha);
                    return fechaObj.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                } catch {
                    return 'Fecha inválida';
                }
            },
            size: 120,
        }),
        columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => {
                const solicitud = row.original;

                return (
                    <div className="flex items-center gap-2">
                        {/* Ver detalles */}
                        <button
                            onClick={async (e) => {
                                e.stopPropagation(); // Evita que se dispare el click de la fila

                                const tipo = solicitud.Tipo_Persona === 'Físico' ? 'solicitud-fisica' : 'solicitud-juridica';

                                // Si el estado actual NO es "Pendiente" (2), marcarlo como pendiente
                                if (solicitud.Estado.Id_Estado === 1) {
                                    try {
                                        console.log(' Marcando solicitud como pendiente...', solicitud.Id);
                                        await marcarEnRevisionMutation.mutateAsync(solicitud.Id);
                                        console.log(' Solicitud marcada como pendiente');
                                    } catch (error) {
                                        console.error(' Error al marcar como pendiente:', error);
                                    }
                                }

                                // Abrir el modal
                                setSelectedSolicitudForGestion({
                                    tipo: tipo,
                                    datos: solicitud.datos_originales
                                });
                                setShowGestionModal(true);
                            }}
                            disabled={marcarEnRevisionMutation.isPending}
                            className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ver detalles"
                        >
                            Ver
                        </button>

                        {/* Editar */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSolicitud({
                                    tipo: solicitud.Tipo_Persona === 'Físico'
                                        ? 'solicitud-fisica'
                                        : 'solicitud-juridica',
                                    datos: solicitud.datos_originales
                                });
                                setShowEditModal(true);
                            }}
                            className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            title="Editar solicitud"
                        >
                            Editar
                        </button>


                    </div>
                );
            }
        }),
    ];

    // Declarar la tabla aquí, fuera de columns
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

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full flex items-center justify-center py-12">
                <div className="text-center">
                    <p className="text-red-600 mb-2">Error al cargar las solicitudes</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-col justify-start">
                    <h2 className="text-2xl font-bold text-gray-900">Revisión de Solicitudes</h2>
                    <p className="text-sm text-gray-600 pb-4">Gestiona las solicitudes de los usuarios</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar por nombre, cédula, tipo, estado..."
                        className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
                    />

                </div>
            </div>


            <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-sky-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                                    {headerGroup.headers.map((header, index) => (
                                        <th key={header.id} className={`px-2 sm:px-4 py-3 font-medium border-b border-sky-100 ${index === 0 ? 'text-left' : 'text-center'
                                            }`}>
                                            {(() => {
                                                if (header.isPlaceholder) {
                                                    return null;
                                                }
                                                if (header.column.getCanSort()) {
                                                    return (
                                                        <button
                                                            type="button"
                                                            className={`cursor-pointer select-none flex items-center gap-2 bg-transparent border-none p-0 ${index === 0 ? 'justify-start' : 'justify-center'
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
                                    <td colSpan={5} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                                        {globalFilter ? 'No se encontraron actas que coincidan con la búsqueda' : 'No hay actas registradas'}
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
                                                <td key={cell.id} className={`px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top ${index === 0 ? 'text-left' : 'text-center'
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

            {/* Modal de edición */}
            {showEditModal && selectedSolicitud && (
                <EditSolicitudModal
                    solicitud={selectedSolicitud}
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedSolicitud(null);
                    }}
                />
            )}

            {/* Modal de gestión de estados (aprobar/rechazar) */}
            {showGestionModal && selectedSolicitudForGestion && (
                <ModalSolicitud
                    isOpen={showGestionModal}
                    onClose={() => {
                        setShowGestionModal(false);
                        setSelectedSolicitudForGestion(null);
                    }}
                    solicitud={selectedSolicitudForGestion}
                />
            )}


        </div>
    );
}

