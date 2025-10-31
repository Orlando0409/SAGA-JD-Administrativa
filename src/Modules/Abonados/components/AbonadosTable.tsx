import { useMemo, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { User, Building, Plus } from 'lucide-react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { LuSearch } from 'react-icons/lu';
import { useAfiliadosFisicos } from '../Hook/HookAfiliadoFisico';
import { useAfiliadosJuridicos } from '../Hook/HookAfiliadoJuridico';
import DetailAbonados from './DetailAfiliado';
import CreateModal from './CreateModal';
import EditModal from './EditModal'; // ✅ Agregar import
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter
} from "@/Modules/Global/components/Sidebar/ui/alert-dialog";
import type { AfiliadoFisico } from '../Models/TablaAfiliados/ModeloAfiliadoFisico';
import type { AfiliadoJuridico } from '../Models/TablaAfiliados/ModeloAfiliadoJuridico';

// Tipo unificado para la tabla
type AfiliadoUnificado = {
    Id: number;
    Nombre_Completo: string;
    Cedula_Documento?: string;
    Identificacion: string;
    Estado: {
        Id_Estado: number;
        Nombre_Estado: string;
    };
    Tipo_Persona: 'Físico' | 'Jurídico';
    Tipo_Afiliado: 'Abonado' | 'Asociado';
    Tipo_Identificacion?: string;
    datos_originales: AfiliadoFisico | AfiliadoJuridico;
};

export default function AbonadosTable() {
    const { afiliadosFisicos, isLoading: loadingFisicos, isError: errorFisicos, updateEstadoAfiliadoFisico: updateEstadoMutationFisico } = useAfiliadosFisicos();
    const { afiliadosJuridicos, isLoading: loadingJuridicos, isError: errorJuridicos, updateEstadoAfiliadoJuridico: updateEstadoMutationJuridico } = useAfiliadosJuridicos();

    const [globalFilter, setGlobalFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState<string>('Todos'); // Filtro de estado
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // ✅ Agregar estado para EditModal
    const [selectedPersona, setSelectedPersona] = useState<{
        tipo: 'afiliado-fisico' | 'afiliado-juridico';
        datos: AfiliadoFisico | AfiliadoJuridico;
    } | null>(null);

    const pageSizeOptions = [5, 10, 20, 50];
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

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
            Tipo_Identificacion: (afiliado as any).Tipo_Identificacion || 'Sin dato',
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
            Tipo_Identificacion: 'Cédula Jurídica',
            datos_originales: afiliado
        }));

        return [
            ...afiliadosFisicosUnificados,
            ...afiliadosJuridicosUnificados
        ].sort((a, b) => a.Id - b.Id);
    }, [afiliadosFisicos, afiliadosJuridicos]);

    // Filtrar por estado
    const filteredByEstado = useMemo(() => {
        if (estadoFilter === 'Todos') return datosUnificados;
        return datosUnificados.filter(afiliado => afiliado.Estado.Nombre_Estado === estadoFilter);
    }, [datosUnificados, estadoFilter]);

    // Filtrar por búsqueda global
    const filteredData = useMemo(() => {
        if (!globalFilter) return filteredByEstado;
        const q = globalFilter.toLowerCase();
        return filteredByEstado.filter((afiliado) =>
            [afiliado.Nombre_Completo, afiliado.Cedula_Documento, afiliado.Estado.Nombre_Estado, afiliado.Tipo_Persona, afiliado.Tipo_Afiliado, afiliado.Tipo_Identificacion]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(q)
        );
    }, [filteredByEstado, globalFilter]);

    const handleViewDetail = (persona: AfiliadoUnificado) => {
        const tipo = persona.Tipo_Persona === 'Físico' ? 'afiliado-fisico' : 'afiliado-juridico';
        setSelectedPersona({
            tipo,
            datos: persona.datos_originales
        });
        setShowDetailModal(true);
    };

    const handleEdit = (persona: AfiliadoUnificado) => { // ✅ Agregar función para editar
        const tipo = persona.Tipo_Persona === 'Físico' ? 'afiliado-fisico' : 'afiliado-juridico';
        setSelectedPersona({
            tipo,
            datos: persona.datos_originales
        });
        setShowEditModal(true);
    };

    const handleToggleEstado = async (persona: AfiliadoUnificado) => {
        const nuevoEstadoId = persona.Estado.Id_Estado === 1 ? 2 : 1; // 1: Activo, 2: Inactivo
        const id = persona.Id.toString();

        try {
            if (persona.Tipo_Persona === 'Físico') {
                await updateEstadoMutationFisico.mutateAsync({ id, nuevoEstadoId });
            } else {
                await updateEstadoMutationJuridico.mutateAsync({ id, nuevoEstadoId });
            }
            console.log('Estado actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            alert('Error al actualizar el estado. Intente nuevamente.');
        }
    };

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
            },
            size: 200,
        }),
        columnHelper.accessor('Identificacion', {
            header: 'Cédula / Documento',
            cell: (info) => info.getValue() || 'Sin dato',
            size: 150,
        }),
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
                    return <span className={`${base} bg-red-100 text-red-700`}>Inactivo</span>;
                } else if (estadoNombre === 'Pendiente') {
                    return <span className={`${base} bg-amber-100 text-amber-700`}>Pendiente</span>;
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
        columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: ({ row }) => {
                const persona = row.original;
                return (
                    <div className="flex justify-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(persona);
                            }}
                            className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                            title="Ver detalles"
                        >
                            Ver
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(persona); // ✅ Cambiar para abrir EditModal
                            }}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            title="Editar"
                        >
                            Editar
                        </button>
                        {persona.Estado.Nombre_Estado === 'Activo' ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                        disabled={updateEstadoMutationFisico.isPending || updateEstadoMutationJuridico.isPending}
                                        title="Desactivar"
                                    >
                                        Desactivar
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            <span>¿Desactivar afiliado?</span>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <span>¿Estás seguro de que deseas desactivar al afiliado "{persona.Nombre_Completo}"?</span>
                                            <br />
                                            <span>Esta acción puede revertirse posteriormente.</span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction
                                            onClick={() => handleToggleEstado(persona)}
                                            disabled={updateEstadoMutationFisico.isPending || updateEstadoMutationJuridico.isPending}
                                        >
                                            <span>Desactivar</span>
                                        </AlertDialogAction>
                                        <AlertDialogCancel>
                                            <span>Cancelar</span>
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button
                                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                        disabled={updateEstadoMutationFisico.isPending || updateEstadoMutationJuridico.isPending}
                                        title="Activar"
                                    >
                                        Activar
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            <span>¿Activar afiliado?</span>
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <span>¿Estás seguro de que deseas activar al afiliado "{persona.Nombre_Completo}"?</span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogAction
                                            onClick={() => handleToggleEstado(persona)}
                                            disabled={updateEstadoMutationFisico.isPending || updateEstadoMutationJuridico.isPending}
                                        >
                                            <span>Activar</span>
                                        </AlertDialogAction>
                                        <AlertDialogCancel>
                                            <span>Cancelar</span>
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                );
            },
            size: 150,
        }),
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando afiliados...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 p-4">
                Error al cargar los afiliados. Por favor, intenta nuevamente.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Encabezado con filtro de estado, búsqueda y botón */}
            <div className="bg-white rounded-lg p-3">
                 <div className="flex items-start gap-4 flex-col justify-start">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de afiliados</h2>
                    <p className="text-sm text-gray-600 pb-4">Gestiona los afiliados de la ASADA</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor='estado' className="text-sm font-medium text-gray-700">Estado:</label>
                        <select
                            id='estado'
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="Todos">Todos los afiliados</option>
                            <option value="Activo">Activos</option>
                            <option value="Inactivo">Inactivos</option>
                            <option value="Pendiente">Pendientes</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar afiliados..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo Afiliado
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla con scroll vertical y horizontal */}
            <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-sky-50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                                    {headerGroup.headers.map((header, index) => (
                                        <th key={header.id} className={`px-2 sm:px-4 py-3 font-medium border-b border-sky-100 ${
                                            index === 0 ? 'text-left' : 'text-center'
                                        }`}>
                                            {(() => {
                                                if (header.isPlaceholder) {
                                                    return null;
                                                }
                                                if (header.column.getCanSort()) {
                                                    return (
                                                        <button
                                                            type="button"
                                                            className={`cursor-pointer select-none flex items-center gap-2 bg-transparent border-none p-0 ${
                                                                index === 0 ? 'justify-start' : 'justify-center'
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
                                    <td colSpan={columns.length} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                                        {globalFilter ? 'No se encontraron afiliados que coincidan con la búsqueda' : 'No hay afiliados registrados'}
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
                                                <td key={cell.id} className={`px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top ${
                                                    index === 0 ? 'text-left' : 'text-center'
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

                {/* Paginación completa */}
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

            {/* Modal de editar */}
            {showEditModal && selectedPersona && (
                <EditModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedPersona(null);
                    }}
                    persona={selectedPersona}
                />
            )}
        </div>
    );
}