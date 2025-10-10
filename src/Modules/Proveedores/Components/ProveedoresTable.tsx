import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender, type ColumnDef } from '@tanstack/react-table';
import { Building2 } from 'lucide-react';
import { useProveedoresFisicos } from '../Hook/hookFisicoProveedor';
import { useProveedoresJuridicos } from '../Hook/hookjuridicoproveedor';
import { formatCedulaJuridica, formatPhoneNumberDisplay } from '../Schema/SchemaProveedorJuridico';
import type { ProveedorFisico } from '../Models/TablaProveedo/tablaFisicoProveedor';
import type { ProveedorJuridico } from '../Models/TablaProveedo/tablaJuridicoProveedor';
import CreateModalProveedor from './CreateModalProveedor';
import ProveedorDetailModal from './DetailFisicoProveedor';
import ProveedorJuridicoDetailModal from './DetailJuridicoProveedor';

// Tipo unificado para la tabla (similar al patrón de AbonadosTable)
type ProveedorUnificado = {
    Id_Proveedor: number;
    Nombre_Proveedor: string;
    Telefono_Proveedor: string;
    Identificacion_Unificada: string; // Campo unificado para ambos tipos
    Tipo_Identificacion_Unificado: string; // Campo unificado para ambos tipos
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
    const { proveedoresFisicos, isLoading: isLoadingFisicos, isError: isErrorFisicos, error: errorFisicos } = useProveedoresFisicos();
    const { proveedoresJuridicos, isLoading: isLoadingJuridicos, isError: isErrorJuridicos, error: errorJuridicos } = useProveedoresJuridicos();

    const [globalFilter, setGlobalFilter] = useState('');

    // Estados para los modales de detalle
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showJuridicoDetailModal, setShowJuridicoDetailModal] = useState(false);
    const [selectedProveedorFisico, setSelectedProveedorFisico] = useState<ProveedorFisico | null>(null);
    const [selectedProveedorJuridico, setSelectedProveedorJuridico] = useState<ProveedorJuridico | null>(null);

    // Estados para el modal de creación
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Combinar ambos tipos de proveedores en una lista unificada (similar a AbonadosTable)
    const proveedoresUnificados = useMemo((): ProveedorUnificado[] => {
        const fisicosMapeados: ProveedorUnificado[] = proveedoresFisicos.map((proveedor: ProveedorFisico) => ({
            Id_Proveedor: proveedor.Id_Proveedor,
            Nombre_Proveedor: proveedor.Nombre_Proveedor,
            Telefono_Proveedor: proveedor.Telefono_Proveedor,
            Identificacion_Unificada: proveedor.Identificacion || 'Sin identificación',
            Tipo_Identificacion_Unificado: proveedor.Tipo_Identificacion || 'Sin tipo',
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
            Tipo_Identificacion_Unificado: 'Cédula Jurídica',
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

    // Estados de carga y error combinados
    const isLoading = isLoadingFisicos || isLoadingJuridicos;
    const isError = isErrorFisicos || isErrorJuridicos;
    const error = errorFisicos || errorJuridicos;

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
                proveedor.Tipo_Identificacion_Unificado,
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
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tipo === 'Físico' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-teal-100 text-teal-700'
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
                return nombre || 'Sin nombre';
            }
        }),
        
        columnHelper.accessor('Identificacion_Unificada', {
            header: 'Identificación',
            cell: (info) => {
                const proveedor = info.row.original;
                
                return (
                    <div className="flex flex-col">
                        <span className="font-medium">{proveedor.Identificacion_Unificada}</span>
                        <span className="text-xs text-slate-500">
                            {proveedor.Tipo_Proveedor === 'Jurídico' 
                                ? 'Cédula Jurídica' 
                                : proveedor.Tipo_Identificacion_Unificado
                            }
                        </span>
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
                return formattedPhone;
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