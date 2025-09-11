
import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash } from 'lucide-react';
import { useAbonados } from '../Hook/HookAbonadoFisico';
import { useAbonadosJuridicos } from '../Hook/HookAbonadoJuridico';
import { useAsociadosFisicos } from '../Hook/Asociado/HookAsociadoFisico';
import { useAsociadosJuridicos } from '../Hook/Asociado/HookAsociadoJuridico';
import type { Abonado } from '../Models/ModeloAbonadoFisico';
import type { AbonadoJuridico } from '../Models/ModeloAbonadoJuridico';
import type { AsociadoFisico } from '../Models/Asociado/ModeloAsociadoFisico';
import type { AsociadoJuridico } from '../Models/Asociado/ModeloAsociadoJuridico';

// Tipo unificado para la tabla
type PersonaUnificada = {
    Id: number;
    Nombre_Completo: string;
    Cedula_Documento: string;
    Estado: {
        Id_Estado: number;
        Nombre_Estado: string;
    };
    Tipo_Persona: 'Físico' | 'Jurídico';
    Tipo_Afiliado: 'Abonado' | 'Asociado';
    // Datos originales para acciones
    datos_originales: Abonado | AbonadoJuridico | AsociadoFisico | AsociadoJuridico;
};

export default function AbonadosTable() {
    // Hooks para ambos tipos de abonados
    const { abonados: abonadosFisicos, isLoading: loadingFisicos, isError: errorFisicos, deleteAbonado } = useAbonados();
    const { abonadosJuridicos, isLoading: loadingJuridicos, isError: errorJuridicos, deleteAbonadoJuridico } = useAbonadosJuridicos();

    // Hooks para ambos tipos de asociados
    const { asociadosFisicos, isLoading: loadingAsociadosFisicos, isError: errorAsociadosFisicos, deleteAsociadoFisico } = useAsociadosFisicos();
    const { asociadosJuridicos, isLoading: loadingAsociadosJuridicos, isError: errorAsociadosJuridicos, deleteAsociadoJuridico } = useAsociadosJuridicos();

    const [globalFilter, setGlobalFilter] = useState('');

    // Estados combinados
    const isLoading = loadingFisicos || loadingJuridicos || loadingAsociadosFisicos || loadingAsociadosJuridicos;
    const isError = errorFisicos || errorJuridicos || errorAsociadosFisicos || errorAsociadosJuridicos;

    // Función para unificar los datos
    const datosUnificados = useMemo((): PersonaUnificada[] => {
        // Abonados Físicos
        const abonadosFisicosUnificados: PersonaUnificada[] = abonadosFisicos.map(abonado => ({
            Id: abonado.Id_Abonado,
            Nombre_Completo: `${abonado.Nombre} ${abonado.Apellido1} ${abonado.Apellido2 || ''}`.trim(),
            Cedula_Documento: abonado.Cedula,
            Estado: {
                Id_Estado: abonado.Estado.Id_Estado_Afiliado,
                Nombre_Estado: abonado.Estado.Nombre_Estado
            },
            Tipo_Persona: 'Físico' as const,
            Tipo_Afiliado: 'Abonado' as const,
            datos_originales: abonado
        }));

        // Abonados Jurídicos
        const abonadosJuridicosUnificados: PersonaUnificada[] = abonadosJuridicos.map(abonado => ({
            Id: abonado.Id_Abonado,
            Nombre_Completo: abonado.Razon_Social,
            Cedula_Documento: abonado.Cedula_Juridica,
            Estado: {
                Id_Estado: abonado.Estado.Id_Estado_Afiliado,
                Nombre_Estado: abonado.Estado.Nombre_Estado
            },
            Tipo_Persona: 'Jurídico' as const,
            Tipo_Afiliado: 'Abonado' as const,
            datos_originales: abonado
        }));

        // Asociados Físicos
        const asociadosFisicosUnificados: PersonaUnificada[] = asociadosFisicos.map(asociado => ({
            Id: asociado.Id_Asociado || 0,
            Nombre_Completo: `${asociado.Nombre} ${asociado.Apellido1} ${asociado.Apellido2 || ''}`.trim(),
            Cedula_Documento: asociado.Cedula,
            Estado: {
                Id_Estado: asociado.Estado?.Id_Estado_Solicitud || 1,
                Nombre_Estado: asociado.Estado?.Nombre_Estado || 'Pendiente'
            },
            Tipo_Persona: 'Físico' as const,
            Tipo_Afiliado: 'Asociado' as const,
            datos_originales: asociado
        }));

        // Asociados Jurídicos
        const asociadosJuridicosUnificados: PersonaUnificada[] = asociadosJuridicos.map(asociado => ({
            Id: asociado.Id_Asociado || 0,
            Nombre_Completo: asociado.Razon_Social,
            Cedula_Documento: asociado.Cedula_Juridica,
            Estado: {
                Id_Estado: asociado.Estado?.Id_Estado_Solicitud || 1,
                Nombre_Estado: asociado.Estado?.Nombre_Estado || 'Pendiente'
            },
            Tipo_Persona: 'Jurídico' as const,
            Tipo_Afiliado: 'Asociado' as const,
            datos_originales: asociado
        }));

        return [
            ...abonadosFisicosUnificados,
            ...abonadosJuridicosUnificados,
            ...asociadosFisicosUnificados,
            ...asociadosJuridicosUnificados
        ].sort((a, b) => a.Id - b.Id);
    }, [abonadosFisicos, abonadosJuridicos, asociadosFisicos, asociadosJuridicos]);

    const handleDelete = async (persona: PersonaUnificada) => {
        const nombreCompleto = persona.Nombre_Completo;
        const tipoPersona = persona.Tipo_Persona;
        const tipoAfiliado = persona.Tipo_Afiliado;

        if (confirm(`¿Está seguro de eliminar al ${tipoAfiliado.toLowerCase()} ${tipoPersona.toLowerCase()} ${nombreCompleto}?`)) {
            try {
                if (persona.Tipo_Afiliado === 'Abonado') {
                    if (persona.Tipo_Persona === 'Físico') {
                        await deleteAbonado(persona.Id);
                    } else {
                        await deleteAbonadoJuridico(persona.Id);
                    }
                } else { // Asociado
                    if (persona.Tipo_Persona === 'Físico') {
                        await deleteAsociadoFisico(persona.Id);
                    } else {
                        await deleteAsociadoJuridico(persona.Id);
                    }
                }
                alert(`${tipoAfiliado} eliminado exitosamente`);
            } catch (error) {
                alert(`Error al eliminar el ${tipoAfiliado.toLowerCase()}`);
                console.error('Error:', error);
            }
        }
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return datosUnificados;
        const q = globalFilter.toLowerCase();
        return datosUnificados.filter((persona) =>
            [persona.Nombre_Completo, persona.Cedula_Documento, persona.Estado.Nombre_Estado, persona.Tipo_Persona, persona.Tipo_Afiliado]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [datosUnificados, globalFilter]);

    const columnHelper = createColumnHelper<PersonaUnificada>();
    const columns: ColumnDef<PersonaUnificada, any>[] = [
        columnHelper.accessor('Id', {
            header: 'ID',
            cell: (info) => info.getValue(),
            size: 50
        }),
        columnHelper.accessor('Nombre_Completo', {
            header: 'Nombre / Razón Social',
            cell: (info) => info.getValue()
        }),
        columnHelper.accessor('Cedula_Documento', {
            header: 'Cédula / Cédula Jurídica',
            cell: (info) => info.getValue(),
            size: 160
        }),
        columnHelper.accessor('Estado', {
            header: 'Estado',
            cell: (info) => {
                const estado = info.getValue();
                const estadoNombre = estado?.Nombre_Estado || 'Sin estado';

                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';

                if (estadoNombre === 'Activo') {
                    return <span className={`${base} bg-green-100 text-green-700`}>✓ Activo</span>;
                } else if (estadoNombre === 'Inactivo') {
                    return <span className={`${base} bg-red-100 text-red-700`}>✕ Inactivo</span>;
                } else if (estadoNombre === 'Pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700`}>⏳ Pendiente</span>;
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
                        {tipo === 'Físico' ? '👤' : '🏢'} {tipo}
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
                        {tipo === 'Abonado' ? '💧' : '🤝'} {tipo}
                    </span>
                );
            },
            size: 120,
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const persona = row.original as PersonaUnificada;
                return (
                    <div className="flex items-center gap-2">
                        <button title="Ver" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100" onClick={() => alert(`Ver ${persona.Tipo_Afiliado.toLowerCase()}: ${persona.Nombre_Completo}`)}><Eye size={14} /></button>
                        <button title="Editar" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sky-700 bg-white hover:bg-sky-50 border border-sky-100" onClick={() => alert(`Editar ${persona.Tipo_Afiliado.toLowerCase()}: ${persona.Nombre_Completo}`)}><Edit size={14} /></button>
                        <button title="Eliminar" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-slate-600 bg-white hover:bg-slate-50 border border-slate-100" onClick={() => handleDelete(persona)}><Trash size={14} /></button>
                    </div>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-sky-800">Gestión de Personas</h2>
                    <span className="text-sm text-slate-500">Abonados y Asociados (Físicos y Jurídicos)</span>
                </div>
                <div className="flex items-center gap-3">
                    <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar por nombre, cédula, estado, tipo..." className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200" />
                    <button className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm" onClick={() => alert('Crear solicitud — abrir formulario')}>+ Nueva Solicitud</button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="text-left text-sm text-sky-700">
                                {hg.headers.map((header) => (
                                    <th key={header.id} className="px-4 py-3 font-medium border-b border-sky-100">
                                        {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-slate-500">
                                    Cargando...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-red-500">
                                    Error al cargar los datos
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-6 text-center text-slate-500">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-sky-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3 text-sm text-slate-700 align-top">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between gap-4 mt-4">
                <div className="text-sm text-slate-600">
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} de {filteredData.length}
                </div>
                <div className="flex items-center gap-2">
                    <select value={table.getState().pagination.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))} className="px-2 py-1 rounded-md border border-sky-100">{[5, 8, 12, 20].map((s) => (<option key={s} value={s}>{s} / pág</option>))}</select>
                    <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50">Anterior</button>
                    <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50">Siguiente</button>
                </div>
            </div>
        </div>
    );
}
