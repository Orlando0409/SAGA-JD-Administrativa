import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from '@tanstack/react-table';
import { User, Building } from 'lucide-react';
import { useAfiliadosFisicos } from '../Hook/HookAfiliadoFisico';
import { useAfiliadosJuridicos } from '../Hook/HookAfiliadoJuridico';
import DetailAbonados from './DetailAbonados';
import CreateModal from './CreateModal';
import type { AfiliadoFisico } from '../Models/TablaAfiliados/ModeloAfiliadoFisico';
import type { AfiliadoJuridico } from '../Models/TablaAfiliados/ModeloAfiliadoJuridico';
import FormularioAfiliados from './FormularioAfiliados';

// Tipo unificado para la tabla
type AfiliadoUnificado = {
    Id: number;
    Nombre_Completo: string;
    Cedula_Documento?: string; // Para cédula o documento jurídico
    Identificacion: string;
    Estado: {
        Id_Estado: number;
        Nombre_Estado: string;
    };
    Tipo_Persona: 'Físico' | 'Jurídico';
    Tipo_Afiliado: 'Abonado' | 'Asociado';
    Tipo_Identificacion?: string; // <-- FIX: Añadido campo
    datos_originales: AfiliadoFisico | AfiliadoJuridico;
};

export default function AbonadosTable() {
    const { afiliadosFisicos, isLoading: loadingFisicos, isError: errorFisicos } = useAfiliadosFisicos();
    const { afiliadosJuridicos, isLoading: loadingJuridicos, isError: errorJuridicos } = useAfiliadosJuridicos();

    const [globalFilter, setGlobalFilter] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState<{
        tipo: 'afiliado-fisico' | 'afiliado-juridico';
        datos: AfiliadoFisico | AfiliadoJuridico;
    } | null>(null);

    const isLoading = loadingFisicos || loadingJuridicos;
    const isError = errorFisicos || errorJuridicos;

    // Unificar datos y agregar Tipo_Identificacion
    const datosUnificados = useMemo((): AfiliadoUnificado[] => {
        const afiliadosFisicosUnificados: AfiliadoUnificado[] = afiliadosFisicos.map((afiliado: AfiliadoFisico) => ({
            Id: afiliado.Id_Afiliado,
            Nombre_Completo: `${afiliado.Nombre || ''} ${afiliado.Apellido1 || ''} ${afiliado.Apellido2 || ''}`.trim() || 'Sin nombre',
            Identificacion: afiliado.Identificacion || 'Sin cédula',
            Estado: {
                Id_Estado: afiliado.Estado?.Id_Estado_Afiliado || 0,
                Nombre_Estado: afiliado.Estado?.Nombre_Estado || 'Sin estado'
            },
            Tipo_Persona: 'Físico' as const,
            Tipo_Afiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado as 'Abonado' | 'Asociado' || 'Asociado',
            Tipo_Identificacion: (afiliado as any).Tipo_Identificacion || 'Sin dato', // <-- CAMBIO: Mapeo del campo
            datos_originales: afiliado
        }));

        const afiliadosJuridicosUnificados: AfiliadoUnificado[] = afiliadosJuridicos.map((afiliado: AfiliadoJuridico) => ({
            Id: afiliado.Id_Afiliado,
            Nombre_Completo: afiliado.Razon_Social || 'Sin razón social',
            Cedula_Documento: afiliado.Cedula_Juridica || 'Sin cédula jurídica',
            Identificacion: afiliado.Cedula_Juridica || 'Sin cédula jurídica',
            Estado: {
                Id_Estado: afiliado.Estado?.Id_Estado_Afiliado || 0,
                Nombre_Estado: afiliado.Estado?.Nombre_Estado || 'Sin estado'
            },
            Tipo_Persona: 'Jurídico' as const,
            Tipo_Afiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado as 'Abonado' | 'Asociado' || 'Asociado',
            Tipo_Identificacion: 'Cédula Jurídica', // ✅ CAMBIO: Siempre será "Cédula Jurídica" para jurídicos
            datos_originales: afiliado
        }));

        return [
            ...afiliadosFisicosUnificados,
            ...afiliadosJuridicosUnificados
        ].sort((a, b) => a.Id - b.Id);
    }, [afiliadosFisicos, afiliadosJuridicos]);

    const handleViewDetail = (persona: AfiliadoUnificado) => {
        const tipo = persona.Tipo_Persona === 'Físico' ? 'afiliado-fisico' : 'afiliado-juridico';
        setSelectedPersona({
            tipo,
            datos: persona.datos_originales
        });
        setShowDetailModal(true);
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return datosUnificados;
        const q = globalFilter.toLowerCase();
        return datosUnificados.filter((afiliado) =>
            [afiliado.Nombre_Completo, afiliado.Cedula_Documento, afiliado.Estado.Nombre_Estado, afiliado.Tipo_Persona, afiliado.Tipo_Afiliado, afiliado.Tipo_Identificacion] // <-- CAMBIO: Incluido en filtro
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [datosUnificados, globalFilter]);

    const columnHelper = createColumnHelper<AfiliadoUnificado>();
    const columns: ColumnDef<AfiliadoUnificado, any>[] = [
        columnHelper.accessor('Nombre_Completo', {
            header: 'Nombre / Razón Social',
            cell: (info) => {
                const fila = info.row.original;
                if (fila.Tipo_Persona === 'Físico') {
                    const datosOriginales = fila.datos_originales as AfiliadoFisico;
                    if (!datosOriginales.Nombre && !datosOriginales.Apellido1) {
                        return 'Datos no disponibles';
                    }
                    const nombreCompleto = `${datosOriginales.Nombre || ''} ${datosOriginales.Apellido1 || ''} ${datosOriginales.Apellido2 || ''}`.trim();
                    return nombreCompleto || 'Sin nombre';
                } else {
                    const datosOriginales = fila.datos_originales as AfiliadoJuridico;
                    return datosOriginales.Razon_Social || 'Sin razón social';
                }
            }
        }),
        columnHelper.accessor('Cedula_Documento', {
            header: 'Número Identificación / Cédula Jurídica', // <-- CAMBIO: Nuevo encabezado
            cell: (info) => {
                const fila = info.row.original;
                if (fila.Tipo_Persona === 'Físico') {
                    const datosOriginales = fila.datos_originales as AfiliadoFisico;
                    return datosOriginales.Identificacion || 'Sin número de identificación'; // <-- CAMBIO: usa Numero_Identidad
                } else {
                    const datosOriginales = fila.datos_originales as AfiliadoJuridico;
                    return datosOriginales.Cedula_Juridica || 'Sin cédula jurídica';
                }
            },
            size: 160
        }),
        // <-- CAMBIO: Nueva columna Tipo_Identificacion después de cédula
        columnHelper.accessor('Tipo_Identificacion', {
            header: 'Tipo Identificación',
            cell: (info) => info.getValue() || 'Sin dato',
            size: 120,
        }),
        columnHelper.accessor('Estado', {
            header: 'Estado',
            cell: (info) => {
                const estado = info.getValue();
                const estadoNombre = estado?.Nombre_Estado || 'Sin estado';
                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';
                if (estadoNombre === 'Activo') {
                    return <span className={`${base} bg-green-100 text-green-700`}>Activo</span>;
                } else if (estadoNombre === 'Inactivo') {
                    return <span className={`${base} bg-red-100 text-red-700`}> Inactivo</span>;
                } else if (estadoNombre === 'Pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700`}> Pendiente</span>;
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
        columnHelper.accessor('Tipo_Afiliado', {
            header: 'Tipo Afiliado',
            cell: (info) => {
                const tipo = info.getValue();
                return (
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${tipo === 'Abonado'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-orange-100 text-orange-700'
                        }`}>
                        {tipo}
                    </span>
                );
            },
            size: 120,
        }),
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 8 } },
    });

    return (
        <div className="w-full">
            <div className="flex flex-col  sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Afiliados</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar por nombre, cédula, estado, tipo..." className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm" />
                    <button
                        className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm whitespace-nowrap"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Nuevo Afiliado
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="text-left text-xs sm:text-sm text-sky-700">
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">
                                        {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    Cargando...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-red-500 text-sm">
                                    Error al cargar los datos
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                                    onClick={() => handleViewDetail(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} de {filteredData.length}
                </div>
                <div className="flex items-center justify-center sm:justify-end gap-2">
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 sm:px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50 text-xs sm:text-sm">Anterior</button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 sm:px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50 text-xs sm:text-sm">Siguiente</button>
                </div>
            </div>

            {/* Modal de detalle */}
            {showDetailModal && selectedPersona && (
                <DetailAbonados
                    persona={selectedPersona}
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedPersona(null);
                    }}
                />
            )}

            {/* Modal de crear nueva solicitud */}
            <CreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
}