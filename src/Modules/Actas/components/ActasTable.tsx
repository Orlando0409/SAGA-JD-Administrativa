import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuSearch } from 'react-icons/lu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";
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
import { useGetActas, useDeleteActa } from "../Hook/hookActas";
import type { Acta } from "../Models/ActasModels";
import FormularioCrearActas from "./FormularioCrearActas";
import ActasModal from "./ActasModal";
import ActasEdit from "./ActasEdit";
export default function ActasTable() {
    const { data: actas, isLoading, refetch } = useGetActas();
    const deleteActaMutation = useDeleteActa();

    const [globalFilter, setGlobalFilter] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null);

    const pageSizeOptions = [5, 10, 20, 50];
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    // Column helper para definir las columnas
    const columnHelper = createColumnHelper<Acta>();

    // Definir las columnas
    const columns = useMemo(() => [
        columnHelper.accessor('Titulo', {
            header: 'Título',
            cell: info => (
                <div className="font-medium text-left flex items-center gap-2">
                    <span className="truncate">
                        {info.getValue().length > 30
                            ? `${info.getValue().slice(0, 30)}...`
                            : info.getValue()}
                    </span>
                </div>
            ),
        }),
        columnHelper.accessor('Descripcion', {
            header: 'Descripción',
            cell: info => (
                <div className="text-gray-600 text-left">
                    {info.getValue().length > 30
                        ? `${info.getValue().slice(0, 30)}...`
                        : info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('Fecha_Creacion', {
            header: 'Fecha de Creación',
            cell: info => (
                <div className="text-gray-600 text-left">
                    {new Date(info.getValue()).toLocaleDateString("es-ES")}
                </div>
            ),
        }),
        columnHelper.accessor('Fecha_Actualizacion', {
            header: 'Última Actualización',
            cell: info => (
                <div className="text-gray-600 text-left">
                    {info.getValue()
                        ? new Date(info.getValue()).toLocaleDateString("es-ES")
                        : "Sin actualizar"}
                </div>
            ),
        }),
        columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: info => (
                <div className="flex justify-center gap-1">
                    <button
                        className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        onClick={() => handleViewDetail(info.row.original)}
                        title="Ver detalles"
                    >
                        Ver
                    </button>
                    <button
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        onClick={() => handleEdit(info.row.original)}
                        title="Editar"
                    >
                        Editar
                    </button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                disabled={deleteActaMutation.isPending}
                                title="Eliminar acta"
                            >
                                Eliminar
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    <span>¿Eliminar acta?</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <span>¿Estás seguro de que deseas eliminar la acta "{info.row.original.Titulo}"? Esta acción no se puede deshacer.</span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction
                                    onClick={() => handleDelete(info.row.original)}
                                    disabled={deleteActaMutation.isPending}
                                >
                                    <span>Eliminar</span>
                                </AlertDialogAction>
                                <AlertDialogCancel>
                                    <span>Cancelar</span>
                                </AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        }),
    ], [deleteActaMutation.isPending]);

    // Funciones para manejar las acciones
    const handleViewDetail = (acta: Acta) => {
        setActaSeleccionada(acta);
        setModalOpen(true);
    };

    const handleEdit = (acta: Acta) => {
        setActaSeleccionada(acta);
        setEditVisible(true);
    };

    const handleDelete = (acta: Acta) => {
        deleteActaMutation.mutate(acta.Id_Acta, {
            onSuccess: () => {
                refetch();
            },
        });
    };

    // Crear la tabla con TanStack Table
    const table = useReactTable({
        data: actas || [],
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
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Encabezado con búsqueda y botón */}
            <div className="bg-white rounded-lg p-3">
                <div className="flex items-start gap-4 flex-col justify-start">
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Actas</h2>
                    <p className="text-sm text-gray-600 pb-4">Lleva un control de las actas de reuniones</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar actas..."
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => setFormVisible(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                        >
                            <LuPlus className="w-4 h-4" />
                            Nueva Acta
                        </button>
                    </div>
                </div>
            </div>

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
                                                            <span className="flex items-center justify-left gap-1">
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

            {/* Modal para crear actas */}
            {formVisible && (
                <FormularioCrearActas
                    onClose={() => setFormVisible(false)}
                    refetch={refetch}
                />
            )}

            {/* Modal para editar actas */}
            {editVisible && actaSeleccionada && (
                <ActasEdit
                    acta={actaSeleccionada}
                    onClose={() => {
                        setEditVisible(false);
                        setActaSeleccionada(null);
                    }}
                    refetch={refetch}
                />
            )}

            {/* Modal para mostrar detalles del acta */}
            {modalOpen && actaSeleccionada && (
                <ActasModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setActaSeleccionada(null);
                    }}
                    acta={actaSeleccionada}
                />
            )}
        </div>
    );
}