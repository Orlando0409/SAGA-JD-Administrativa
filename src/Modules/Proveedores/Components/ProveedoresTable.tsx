import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef, getFilteredRowModel, getSortedRowModel } from '@tanstack/react-table';
import { useProveedoresFisicos } from '../Hook/hookFisicoProveedor';
import { useProveedoresJuridicos } from '../Hook/hookjuridicoproveedor';
import { formatCedulaJuridica, formatPhoneNumberDisplay } from '../Schema/SchemaProveedorJuridico';
import type { ProveedorFisico } from '../Models/TablaProveedo/tablaFisicoProveedor';
import type { ProveedorJuridico } from '../Models/TablaProveedo/tablaJuridicoProveedor';
import CreateModalProveedor from './CreateModalProveedor';
import ProveedorDetailModal from './DetailFisicoProveedor';
import ProveedorJuridicoDetailModal from './DetailJuridicoProveedor';
import EditFisicoProveedoresModal from './EditFisicoProveedoresModal';
import EditJuridicoProveedorModal from './EditJuridicoProveedorModal';
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md';

// Tipo unificado para la tabla (similar al patrón de AbonadosTable)
type ProveedorUnificado = {
    Id_Proveedor: number;
    Nombre_Proveedor: string;
    Telefono_Proveedor: string;
    Identificacion_Unificada: string; // Campo unificado para ambos tipos
    Tipo_Identificacion_Unificada: string; // Campo unificado para ambos tipos
    Estado_Proveedor: {
        Id_Estado_Proveedor: number;
        Estado_Proveedor: string;
    };
    Tipo_Proveedor: 'Físico' | 'Jurídico';
    Razon_Social?: string; // Solo para jurídicos
    Fecha_Creacion: string;
    Fecha_Actualizacion: string;
    datos_originales: ProveedorFisico | ProveedorJuridico;
};

export default function ProveedoresTable() {
    // Hooks para obtener ambos tipos de proveedores
    const { proveedoresFisicos, } = useProveedoresFisicos();
    const { proveedoresJuridicos, } = useProveedoresJuridicos();

    const [globalFilter, setGlobalFilter] = useState('');
    // Estado para la paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 8,
    });
    // Opciones de tamaño de página para la paginación
    const pageSizeOptions = [5, 10, 20, 50];
    // Estados para los modales de detalle
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showJuridicoDetailModal, setShowJuridicoDetailModal] = useState(false);
    const [selectedProveedorFisico, setSelectedProveedorFisico] = useState<ProveedorFisico | null>(null);
    const [selectedProveedorJuridico, setSelectedProveedorJuridico] = useState<ProveedorJuridico | null>(null);

    // Estado para el modal de edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [proveedorEdit, setProveedorEdit] = useState<ProveedorUnificado | null>(null);

    // Estados para el modal de creación
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Combinar ambos tipos de proveedores en una lista unificada (similar a AbonadosTable)
    const proveedoresUnificados = useMemo((): ProveedorUnificado[] => {
        const fisicosMapeados: ProveedorUnificado[] = proveedoresFisicos.map((proveedor: ProveedorFisico) => ({
            Id_Proveedor: proveedor.Id_Proveedor,
            Nombre_Proveedor: proveedor.Nombre_Proveedor,
            Telefono_Proveedor: proveedor.Telefono_Proveedor,
            Identificacion_Unificada: proveedor.Identificacion || 'Sin identificación',
            Tipo_Identificacion_Unificada: proveedor.Tipo_Identificacion || 'Sin tipo',
            Estado_Proveedor: proveedor.Estado_Proveedor,
            Tipo_Proveedor: 'Físico' as const,
            Fecha_Creacion: proveedor.Fecha_Creacion,
            Fecha_Actualizacion: proveedor.Fecha_Actualizacion,
            datos_originales: proveedor
        }));

        const juridicosMapeados: ProveedorUnificado[] = proveedoresJuridicos.map((proveedor: ProveedorJuridico) => ({
            Id_Proveedor: proveedor.Id_Proveedor,
            Nombre_Proveedor: proveedor.Razon_Social || proveedor.Nombre_Proveedor, // Usar Razón Social como nombre principal para la tabla
            Telefono_Proveedor: proveedor.Telefono_Proveedor,
            Identificacion_Unificada: formatCedulaJuridica(proveedor.Cedula_Juridica || ''), // Aplicar formato
            Tipo_Identificacion_Unificada: 'Cédula Jurídica',
            Estado_Proveedor: proveedor.Estado_Proveedor,
            Tipo_Proveedor: 'Jurídico' as const,
            Razon_Social: proveedor.Razon_Social,
            Fecha_Creacion: proveedor.Fecha_Creacion,
            Fecha_Actualizacion: proveedor.Fecha_Actualizacion,
            datos_originales: proveedor
        }));

        return [...fisicosMapeados, ...juridicosMapeados]
            .sort((a, b) => a.Id_Proveedor - b.Id_Proveedor);
    }, [proveedoresFisicos, proveedoresJuridicos]);


    // Función para abrir el modal de detalle correspondiente
    const handleViewDetail = (proveedor: ProveedorUnificado) => {
        if (proveedor.Tipo_Proveedor === 'Físico') {
            // Para proveedores físicos
            setSelectedProveedorFisico(proveedor.datos_originales as ProveedorFisico);
            setShowDetailModal(true);
        } else {
            // Para proveedores jurídicos
            setSelectedProveedorJuridico(proveedor.datos_originales as ProveedorJuridico);
            setShowJuridicoDetailModal(true);
        }
    };

    const filteredData = useMemo(() => {
        if (!globalFilter) return proveedoresUnificados;
        const q = globalFilter.toLowerCase();
        return proveedoresUnificados.filter((proveedor) => {
            const searchFields = [
                proveedor.Nombre_Proveedor,
                proveedor.Telefono_Proveedor,
                proveedor.Estado_Proveedor?.Estado_Proveedor,
                proveedor.Tipo_Proveedor,
                proveedor.Identificacion_Unificada,
                proveedor.Tipo_Identificacion_Unificada,
                proveedor.Razon_Social
            ];

            return searchFields
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q);
        });
    }, [proveedoresUnificados, globalFilter]);

    const columnHelper = createColumnHelper<ProveedorUnificado>();
    const columns: ColumnDef<ProveedorUnificado, any>[] = [
        columnHelper.accessor('Tipo_Proveedor', {
            header: 'Tipo',
            cell: (info) => {
                const tipo = info.getValue();
                return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tipo === 'Físico'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                        {tipo}
                    </span>
                );
            },
            size: 100
        }),
        columnHelper.accessor('Nombre_Proveedor', {
            header: 'Nombre / Razón Social',
            cell: (info) => {
                const nombre = info.getValue();
                return <div className='flex items-center justify-start'>{nombre || 'Sin nombre'}</div>;
            }
        }),

        columnHelper.accessor('Identificacion_Unificada', {
            header: 'Identificación',
            cell: (info) => {
                const proveedor = info.row.original;

                return (
                    <div className='flex items-center justify-start'>
                        <div className="flex flex-col">
                            <span className="font-medium text-start">{proveedor.Identificacion_Unificada}</span>
                            <span className="text-xs text-start text-slate-500">
                                {proveedor.Tipo_Proveedor === 'Jurídico'
                                    ? 'Cédula Jurídica'
                                    : proveedor.Tipo_Identificacion_Unificada
                                }
                            </span>
                        </div>
                    </div>
                );
            },
            size: 160
        }),

        columnHelper.accessor('Telefono_Proveedor', {
            header: 'Teléfono',
            cell: (info) => {
                const telefono = info.getValue();
                if (!telefono) return 'Sin teléfono';

                // Formatear el número para mejor visualización
                const formattedPhone = formatPhoneNumberDisplay(telefono);
                return <div className='flex items-center justify-start'>{formattedPhone}</div>;
            },
        }),
        columnHelper.accessor('Estado_Proveedor', {
            header: 'Estado',
            cell: (info) => {
                const estado = info.getValue();
                const estadoNombre = estado?.Estado_Proveedor || 'Sin estado';
                const base = 'px-3 py-1 rounded-full text-xs font-semibold';

                if (estadoNombre.toLowerCase() === 'activo') {
                    return <span className={`${base} bg-emerald-100 text-emerald-700 border border-emerald-300`}>Activo</span>;
                } else if (estadoNombre.toLowerCase() === 'inactivo') {
                    return <span className={`${base} bg-red-100 text-red-700 border border-red-300`}>Inactivo</span>;
                } else if (estadoNombre.toLowerCase() === 'pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700 border border-amber-300`}>Pendiente</span>;
                }

                return (
                    <div className='flex items-center justify-start'>
                        <span className={`${base} bg-slate-100 text-slate-700`}>{estadoNombre}</span>
                    </div>);
            },

        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: (info) => {
                const proveedor = info.row.original;
                return (
                    <div className='flex items-center justify-center gap-1'>
                        {/* Botón Ver */}
                        <button className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors" onClick={() => handleViewDetail(proveedor)} title="Ver">Ver</button>
                        {/* Botón Editar */}
                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors" onClick={() => { setProveedorEdit(proveedor); setShowEditModal(true); }} title="Editar">Editar</button>
                        {/* Botón Desactivar/Activar */}
                        <button className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors" title="Desactivar">Desactivar</button>
                    </div>
                );
            }
        })
    ];

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

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4 flex-col justify-start">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h2>
                    <p className="text-sm text-gray-600 pb-4">Gestiona los proveedores del sistema</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar por nombre, identificación, teléfono, razón social..."
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

            {/* Modal de detalle de proveedores físicos */}
            <ProveedorDetailModal
                proveedor={selectedProveedorFisico}
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedProveedorFisico(null);
                }}
            />

            {/* Modal de detalle de proveedores jurídicos */}
            <ProveedorJuridicoDetailModal
                proveedor={selectedProveedorJuridico}
                isOpen={showJuridicoDetailModal}
                onClose={() => {
                    setShowJuridicoDetailModal(false);
                    setSelectedProveedorJuridico(null);
                }}
            />

            {/* Modal de edición fuera de la tabla, controlado por el estado global */}
            {showEditModal && proveedorEdit && (
                proveedorEdit.Tipo_Proveedor === 'Físico' ? (
                    <EditFisicoProveedoresModal
                        isOpen={showEditModal}
                        onClose={() => { setShowEditModal(false); setProveedorEdit(null); }}
                        proveedor={proveedorEdit.datos_originales as ProveedorFisico}
                    />
                ) : (
                    <EditJuridicoProveedorModal
                        isOpen={showEditModal}
                        onClose={() => { setShowEditModal(false); setProveedorEdit(null); }}
                        proveedor={proveedorEdit.datos_originales as ProveedorJuridico}
                    />
                )
            )}
            {showCreateModal && (
                <CreateModalProveedor
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
}