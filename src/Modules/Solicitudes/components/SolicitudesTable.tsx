import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    createColumnHelper,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, User, Building, Trash2, Pencil, Eye } from 'lucide-react';

// Importar hooks de solicitudes
import { useSolicitudesFisicas } from '../Hooks/HookSolicitudesFisicas';
import { useSolicitudesJuridicas } from '../Hooks/HookSolicitudesJuridicas';

// Importar tipos
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';

// Importar modal de edición
import EditSolicitudModal from './EditSolicitudModal';
import ModalSolicitud from './ModalSolicitud';

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
                Cedula_Documento: solicitud.Identificacion  || 'Sin identificación',
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
                    onClick={(e) => {
                        e.stopPropagation(); // Evita que se dispare el click de la fila
                        handleViewDetail(solicitud);
                    }}
                    className="p-1 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors"
                    title="Ver detalles"
                >
                    <Eye size={16} />
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
                    className="p-1 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                    title="Editar solicitud"
                >
                    <Pencil size={16} />
                </button>

                {/* Eliminar */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`¿Seguro que deseas eliminar la solicitud de ${solicitud.Nombre_Completo}?`)) {
                            console.log('Eliminar solicitud:', solicitud.Id);
                            // Aquí puedes llamar a una función para eliminar en el backend
                        }
                    }}
                    className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    title="Eliminar solicitud"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        );
    },
    size: 100,
}),

    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 8 } },
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
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Solicitudes</h2>

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



            

            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50 border-b border-sky-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-sky-800 uppercase tracking-wider"
                                        style={{ width: header.getSize() }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.original.id}
                                className="hover:bg-sky-50 cursor-pointer transition-colors"
                                onClick={() => handleViewDetail(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length}
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                        <ChevronLeft size={14} /> <span className="hidden sm:inline">Anterior</span>
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-sky-700 bg-white hover:bg-sky-50 border border-sky-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                        <span className="hidden sm:inline">Siguiente</span> <ChevronRight size={14} />
                    </button>
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
