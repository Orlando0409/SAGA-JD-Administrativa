import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Building2 } from 'lucide-react';
import { useProveedoresFisicos } from '../Hook/proveedoresFisicos';
import ProveedorDetailModal from './proveedorDetailModal';
import CreateModalProveedor from './CreateModalProveedor';
import type { ProveedorFisico } from '../Models/TablaProveedo/proveedorFisico';

export default function ProveedoresTable() {
    // Hook para obtener proveedores físicos
    const { proveedoresFisicos, isLoading, isError, error } = useProveedoresFisicos();

    const [globalFilter, setGlobalFilter] = useState('');

    // Estados para el modal de detalle
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProveedor, setSelectedProveedor] = useState<ProveedorFisico | null>(null);

    // Estados para el modal de creación
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Función para abrir el modal de detalle
    const handleViewDetail = (proveedor: ProveedorFisico) => {
        setSelectedProveedor(proveedor);
        setShowDetailModal(true);
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return proveedoresFisicos;
        const q = globalFilter.toLowerCase();
        return proveedoresFisicos.filter((proveedor) =>
            [
                proveedor.Nombre_Proveedor,
                proveedor.Identificacion,
                proveedor.Tipo_Identificacion,
                proveedor.Telefono_Proveedor,
                proveedor.Estado_Proveedor?.Estado_Proveedor
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [proveedoresFisicos, globalFilter]);

    const columnHelper = createColumnHelper<ProveedorFisico>();
    const columns: ColumnDef<ProveedorFisico, any>[] = [
        columnHelper.accessor('Nombre_Proveedor', {
            header: 'Nombre del Proveedor',
            cell: (info) => {
                const nombre = info.getValue();
                return nombre || 'Sin nombre';
            }
        }),
        
        columnHelper.accessor('Identificacion', {
            header: 'Identificación',
            cell: (info) => {
                const identificacion = info.getValue();
                const tipoIdentificacion = info.row.original.Tipo_Identificacion;
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{identificacion || 'Sin identificación'}</span>
                        <span className="text-xs text-slate-500">{tipoIdentificacion || 'Sin tipo'}</span>
                    </div>
                );
            },
            size: 160
        }),
        columnHelper.accessor('Telefono_Proveedor', {
            header: 'Teléfono',
            cell: (info) => {
                const telefono = info.getValue();
                return telefono || 'Sin teléfono';
            },
            size: 120
        }),
        columnHelper.accessor('Estado_Proveedor', {
            header: 'Estado',
            cell: (info) => {
                const estado = info.getValue();
                const estadoNombre = estado?.Estado_Proveedor || 'Sin estado';

                const base = 'inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium';

                if (estadoNombre.toLowerCase() === 'activo') {
                    return <span className={`${base} bg-green-100 text-green-700`}>Activo</span>;
                } else if (estadoNombre.toLowerCase() === 'inactivo') {
                    return <span className={`${base} bg-red-100 text-red-700`}>Inactivo</span>;
                } else if (estadoNombre.toLowerCase() === 'pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700`}>Pendiente</span>;
                }

                return <span className={`${base} bg-slate-100 text-slate-700`}>{estadoNombre}</span>;
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
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Proveedores</h2>
                    <Building2 className="text-sky-600" size={24} />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input 
                        value={globalFilter} 
                        onChange={(e) => setGlobalFilter(e.target.value)} 
                        placeholder="Buscar por nombre, identificación, teléfono..." 
                        className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm" 
                    />
                    <button 
                        className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm whitespace-nowrap" 
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Nuevo Proveedor
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
                                    Cargando proveedores...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-red-500 text-sm">
                                    Error al cargar los proveedores: {error?.message || 'Error desconocido'}
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    No se encontraron proveedores.
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
                    <button 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()} 
                        className="px-2 sm:px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Anterior
                    </button>
                    <button 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()} 
                        className="px-2 sm:px-3 py-1 rounded-md border border-sky-100 bg-white hover:bg-sky-50 disabled:opacity-50 text-xs sm:text-sm"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            {/* Modal de detalle de proveedores */}
            <ProveedorDetailModal
                proveedor={selectedProveedor}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedProveedor(null);
                }}
            />

            {/* Modal de creación de proveedores */}
            {showCreateModal && (
                <CreateModalProveedor
                    onClose={() => setShowCreateModal(false)}
                    setShowCreateModal={setShowCreateModal}
                />
            )}
        </div>
    );
}