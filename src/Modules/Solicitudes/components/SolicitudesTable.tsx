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

// Importar hooks unificados para cambio de estados
import { useMarcarEnRevision } from '../Hooks/HookEstadosSolicitudes';
import { mapearTipoSolicitud, mapearTipoPersona } from '../Service/EstadoSolicitudes';

// Importar tipos
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';

// Importar modal de edición
import EditSolicitudModal from './EditSolicitudModal';
import ModalSolicitud from './ModalSolicitud';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md';

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

    // Hook unificado para cambiar estado a "En Revisión" (estado 1 → 2)
    const marcarEnRevisionMutation = useMarcarEnRevision();


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
        console.log('📦 Datos originales físicas:', solicitudesFisicas);
        console.log('📦 Datos originales jurídicas:', solicitudesJuridicas);

        // Función para normalizar el nombre del tipo de solicitud
        const normalizarTipoSolicitud = (tipo: string): 'Afiliacion' | 'Desconexion' | 'Cambio de Medidor' | 'Asociado' => {
            const tipoLower = tipo.toLowerCase().trim();
            let resultado: string;

            if (tipoLower.includes('afiliacion')) {
                resultado = 'Afiliacion';
            } else if (tipoLower.includes('desconexion')) {
                resultado = 'Desconexion';
            } else if (tipoLower.includes('cambio') && tipoLower.includes('medidor')) {
                resultado = 'Cambio de Medidor';
            } else if (tipoLower.includes('asociado')) {
                resultado = 'Asociado';
            } else {
                resultado = tipo; // Fallback al tipo original
                console.warn('⚠️ Tipo de solicitud no reconocido:', tipo);
            }

            console.log(`🔄 Normalización: "${tipo}" → "${resultado}"`);
            return resultado as any;
        };

        // Función para aplanar la estructura agrupada por tipo de solicitud
        const aplanarSolicitudes = (datos: any): any[] => {
            if (!datos) {
                console.log('⚠️ No hay datos para aplanar');
                return [];
            }

            // Si ya es un array, devolverlo directamente
            if (Array.isArray(datos)) {
                console.log('✅ Los datos ya son un array:', datos.length, 'elementos');
                return datos;
            }

            // Si es un objeto agrupado por tipo (Afiliacion, Desconexion, etc.)
            console.log('📦 Datos agrupados detectados. Claves:', Object.keys(datos));
            const solicitudesPlanas: any[] = [];

            Object.keys(datos).forEach(tipoSolicitud => {
                const solicitudesDelTipo = datos[tipoSolicitud];
                console.log(`  📂 Procesando tipo: "${tipoSolicitud}"`, {
                    esArray: Array.isArray(solicitudesDelTipo),
                    cantidad: Array.isArray(solicitudesDelTipo) ? solicitudesDelTipo.length : 0,
                    datos: solicitudesDelTipo
                });

                if (Array.isArray(solicitudesDelTipo) && solicitudesDelTipo.length > 0) {
                    // Agregar el Tipo_Solicitud a cada solicitud si no lo tiene
                    solicitudesDelTipo.forEach((solicitud, idx) => {
                        const solicitudConTipo = {
                            ...solicitud,
                            Tipo_Solicitud: solicitud.Tipo_Solicitud || tipoSolicitud
                        };
                        console.log(`    ➕ Agregando solicitud ${idx + 1}:`, {
                            Id: solicitud.Id_Solicitud,
                            Tipo_Original: solicitud.Tipo_Solicitud,
                            Tipo_Asignado: solicitudConTipo.Tipo_Solicitud
                        });
                        solicitudesPlanas.push(solicitudConTipo);
                    });
                }
            });

            console.log('✅ Total de solicitudes aplanadas:', solicitudesPlanas.length);
            return solicitudesPlanas;
        };

        // Aplanar las solicitudes físicas y jurídicas
        const solicitudesFisicasArray = aplanarSolicitudes(solicitudesFisicas);
        const solicitudesJuridicasArray = aplanarSolicitudes(solicitudesJuridicas);

        console.log('📋 Solicitudes físicas aplanadas:', solicitudesFisicasArray);
        console.log('📋 Solicitudes jurídicas aplanadas:', solicitudesJuridicasArray);

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
                Tipo_Solicitud: normalizarTipoSolicitud(solicitud.Tipo_Solicitud || 'Afiliacion'),
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
                Tipo_Solicitud: normalizarTipoSolicitud(solicitud.Tipo_Solicitud || 'Afiliacion'),
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

        console.log('═══════════════════════════════════════');
        console.log('📊 RESUMEN FINAL DE SOLICITUDES');
        console.log('═══════════════════════════════════════');
        console.log(`✅ Total físicas: ${solicitudesFisicasUnificadas.length}`);
        console.log(`✅ Total jurídicas: ${solicitudesJuridicasUnificadas.length}`);
        console.log(`✅ Total general: ${resultado.length}`);
        console.log('═══════════════════════════════════════');
        console.log('📋 Detalle de solicitudes:');
        resultado.forEach((s, idx) => {
            console.log(`  ${idx + 1}. ID:${s.Id} | ${s.Tipo_Solicitud} | ${s.Estado.Nombre_Estado} | ${s.Tipo_Persona} | ${s.Nombre_Completo}`);
        });
        console.log('═══════════════════════════════════════');

        return resultado;
    }, [solicitudesFisicas, solicitudesJuridicas]);

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

                                // Si el estado actual es "Registro" (1), marcarlo como "En Revisión" (2)
                                if (solicitud.Estado.Id_Estado === 1) {
                                    try {
                                        console.log('🔄 Cambiando estado 1 → 2 (En Revisión)...');
                                        console.log('📋 ID en tabla:', solicitud.Id);
                                        console.log('📋 Datos originales completos:', solicitud.datos_originales);
                                        console.log('📋 Tipo Solicitud:', solicitud.Tipo_Solicitud);
                                        console.log('📋 Tipo Persona:', solicitud.Tipo_Persona);

                                        // Obtener el ID real del backend
                                        const datosOriginales = solicitud.datos_originales as any;
                                        const idReal = datosOriginales.Id_Solicitud || datosOriginales.id || datosOriginales.Id || datosOriginales.ID;
                                        console.log('📋 ID REAL del backend:', idReal);

                                        // ⚠️ IMPORTANTE: Usar Tipo_Entidad de los datos originales, no el tipo de la tabla
                                        // Tipo_Entidad: 1 = Física, 2 = Jurídica
                                        const tipoEntidad = datosOriginales.Tipo_Entidad || datosOriginales.Id_Tipo_Entidad;
                                        const tipoPersonaReal = tipoEntidad === 1 ? 'Físico' : 'Jurídico';
                                        console.log('📋 Tipo_Entidad del backend:', tipoEntidad, '→', tipoPersonaReal);

                                        // Mapear los tipos para el servicio unificado
                                        const tipoSolicitudMapeado = mapearTipoSolicitud(solicitud.Tipo_Solicitud);
                                        const tipoPersonaMapeado = mapearTipoPersona(tipoPersonaReal); // ✅ Usar tipo real del backend

                                        console.log('🔀 Tipo mapeado:', tipoSolicitudMapeado, tipoPersonaMapeado);

                                        // Usar el hook unificado (params: tipoSolicitud, tipoPersona, solicitudId)
                                        // IMPORTANTE: Usar el ID real del backend, no el ID de la tabla
                                        await marcarEnRevisionMutation.mutateAsync(
                                            tipoSolicitudMapeado,
                                            tipoPersonaMapeado,
                                            idReal  // ✅ Usar ID real del backend
                                        );

                                        console.log('✅ Estado cambiado exitosamente');
                                    } catch (error) {
                                        console.error('❌ Error al cambiar estado:', error);
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
                                                            <span className="flex items-center justify-center gap-1">
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
                                    <td colSpan={columns.length} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                                        {globalFilter ? 'No se encontraron resultados que coincidan con la búsqueda' : 'No hay solicitudes registradas'}
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

