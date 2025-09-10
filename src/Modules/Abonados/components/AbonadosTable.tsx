
import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Eye, Edit, Trash } from 'lucide-react';
import { useAbonados } from '../Hook/HookAbonado';
import type { Abonado } from '../Models/ModelAbonado';
//original 

export default function AbonadosTable() {
    const { abonados, isLoading, isError, deleteAbonado } = useAbonados();
    const [globalFilter, setGlobalFilter] = useState('');

    const handleDelete = async (id: number, nombre: string) => {
        if (confirm(`¿Está seguro de eliminar al abonado ${nombre}?`)) {
            try {
                await deleteAbonado(id);
                alert('Abonado eliminado exitosamente');
            } catch (error) {
                alert('Error al eliminar el abonado');
                console.error('Error:', error);
            }
        }
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return abonados;
        const q = globalFilter.toLowerCase();
        return abonados.filter((a) =>
            [a.nombre, a.cedula, a.direccion, a.telefono, a.estado]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [abonados, globalFilter]);

    const columnHelper = createColumnHelper<Abonado>();
    const columns: ColumnDef<Abonado, any>[] = [
        columnHelper.accessor('id', { header: 'ID', cell: (info) => info.getValue(), size: 50 }),
        columnHelper.accessor('nombre', { header: 'Nombre', cell: (info) => info.getValue() }),
        columnHelper.accessor('cedula', { header: 'Cédula', cell: (info) => info.getValue(), size: 140 }),
        columnHelper.accessor('direccion', { header: 'Dirección', cell: (info) => info.getValue() ?? '-' }),
        columnHelper.accessor('telefono', { header: 'Teléfono', cell: (info) => info.getValue() ?? '-' }),
        columnHelper.accessor('estado', {
            header: 'Estado',
            cell: (info) => {
                const value = info.getValue() as Abonado['estado'];
                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';
                if (value === 'Aprobado') return <span className={`${base} bg-sky-100 text-sky-700`}>✓ Aprobado</span>;
                if (value === 'Pendiente') return <span className={`${base} bg-amber-100 text-amber-700`}>⏳ Pendiente</span>;
                if (value === 'Rechazado') return <span className={`${base} bg-rose-100 text-rose-700`}>✕ Rechazado</span>;
                return <span className={`${base} bg-slate-100 text-slate-700`}>{value}</span>;
            },
            size: 140,
        }),
        columnHelper.accessor('fechaCreacion', {
            header: 'Fecha',
            cell: (info) => (info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : '-'),
            size: 120
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const abonado = row.original as Abonado;
                return (
                    <div className="flex items-center gap-2">
                        <button title="Ver" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-100" onClick={() => alert(`Ver abonado: ${abonado.nombre}`)}><Eye size={14} /></button>
                        <button title="Editar" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-sky-700 bg-white hover:bg-sky-50 border border-sky-100" onClick={() => alert(`Editar abonado: ${abonado.nombre}`)}><Edit size={14} /></button>
                        <button title="Eliminar" className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-slate-600 bg-white hover:bg-slate-50 border border-slate-100" onClick={() => handleDelete(abonado.id, abonado.nombre)}><Trash size={14} /></button>
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
                    <h2 className="text-xl font-semibold text-sky-800">Abonados</h2>
                    <span className="text-sm text-slate-500">Listado de solicitudes y abonados</span>
                </div>
                <div className="flex items-center gap-3">
                    <input value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar por nombre, cédula, dirección..." className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200" />
                    <button className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm" onClick={() => alert('Crear abonado — abrir formulario')}>+ Nuevo abonado</button>
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
                                    No se encontraron abonados.
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
