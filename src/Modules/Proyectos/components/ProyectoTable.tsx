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
import {
    useGetProyectos,
    useToggleVisibilidadProyecto,
    useUpdateEstadoProyecto,
} from "../Hook/HookProyecto";

import { FileText, Eye, EyeOff, Edit3 } from "lucide-react";
import type { Proyecto } from "../Models/ProyectoModels";
import FormularioProyecto from "./ProyectoFormulario";
import ProyectoModal from "./ProyectoModal";


export default function ProyectoTable() {
    const { data: proyectos, isLoading, isError, refetch } = useGetProyectos();
    const toggleVisibilidad = useToggleVisibilidadProyecto();
    const updateEstadoMutation = useUpdateEstadoProyecto();

    const [globalFilter, setGlobalFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState<string>('Todos'); // Por defecto mostrar todos
    const [modalOpen, setModalOpen] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

    const pageSizeOptions = [5, 10, 20, 50];
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    // Filtrar proyectos por estado
    const proyectosFiltrados = useMemo(() => {
        if (!proyectos) return [];
        if (estadoFilter === 'Todos') return proyectos;

        return proyectos.filter(proyecto => {
            const estadoNombre = proyecto.Estado?.Nombre_Estado || '';
            return estadoNombre === estadoFilter;
        });
    }, [proyectos, estadoFilter]);

    const columnHelper = createColumnHelper<Proyecto>();

    const columns = useMemo(() => [
        columnHelper.accessor('Titulo', {
            header: 'Título',
            cell: info => (
                <button
                    className="font-medium transition-colors text-left w-full flex items-center gap-2"
                    onClick={() => handleViewDetail(info.row.original)}
                >
                    <FileText size={18} className="text-sky-600" />
                    <span className="truncate">
                        {info.getValue().length > 30
                            ? `${info.getValue().slice(0, 30)}...`
                            : info.getValue()}
                    </span>
                </button>
            ),
        }),
        columnHelper.accessor('Estado.Nombre_Estado', {
            header: 'Estado',
            cell: info => {
                const estado = info.getValue() || 'En Planeamiento';
                let colorClass = '';

                switch (estado) {
                    case 'En Planeamiento':
                        colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-300';
                        break;
                    case 'En Progreso':
                        colorClass = 'bg-blue-100 text-blue-700 border border-blue-300';
                        break;
                    case 'Terminado':
                        colorClass = 'bg-emerald-100 text-emerald-700 border border-emerald-300';
                        break;
                    default:
                        colorClass = 'bg-slate-200 text-slate-700 border border-slate-400';
                }

                return (
                    <div className="flex justify-start">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                            {estado}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('Fecha_Creacion', {
            header: 'Fecha de creación',
            cell: info => (
                <div className="text-gray-600 text-left">
                    {new Date(info.getValue()).toLocaleDateString("es-ES")}
                </div>
            ),
        }),
        columnHelper.accessor('Visible', {
            header: 'Visibilidad',
            cell: info => {
                const visible = info.getValue();
                return (
                    <div className="flex justify-start">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                            visible
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {visible ? <Eye size={14} /> : <EyeOff size={14} />}
                            {visible ? 'Visible' : 'Oculto'}
                        </span>
                    </div>
                );
            },
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
                    {(() => {
                        const estadoActual = info.row.original.Estado?.Nombre_Estado;
                        const estadoId = info.row.original.Estado?.Id_Estado_Proyecto;

                        switch (estadoId) {
                            case 1: // En Planeamiento
                                return (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                                disabled={updateEstadoMutation.isPending}
                                                title="Iniciar Proyecto"
                                            >
                                                Iniciar
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    <span>¿Iniciar proyecto?</span>
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <span>¿Estás seguro de que deseas cambiar el estado del proyecto "{info.row.original.Titulo}" a "En Progreso"?</span>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction
                                                    onClick={() => handleToggleEstado(info.row.original)}
                                                    disabled={updateEstadoMutation.isPending}
                                                >
                                                    <span>Iniciar Proyecto</span>
                                                </AlertDialogAction>
                                                <AlertDialogCancel>
                                                    <span>Cancelar</span>
                                                </AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            case 2: // En Progreso
                                return (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                                disabled={updateEstadoMutation.isPending}
                                                title="Marcar como Terminado"
                                            >
                                                Terminar
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    <span>¿Marcar como terminado?</span>
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <span>¿Estás seguro de que deseas marcar el proyecto "{info.row.original.Titulo}" como terminado?</span>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction
                                                    onClick={() => handleToggleEstado(info.row.original)}
                                                    disabled={updateEstadoMutation.isPending}
                                                >
                                                    <span>Marcar como Terminado</span>
                                                </AlertDialogAction>
                                                <AlertDialogCancel>
                                                    <span>Cancelar</span>
                                                </AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            case 3: // Terminado
                                return (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                className="px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                                                disabled={updateEstadoMutation.isPending}
                                                title="Reabrir Proyecto"
                                            >
                                                Reabrir
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    <span>¿Reabrir proyecto?</span>
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <span>¿Estás seguro de que deseas reabrir el proyecto "{info.row.original.Titulo}" y cambiar su estado a "En Progreso"?</span>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogAction
                                                    onClick={() => handleToggleEstado(info.row.original)}
                                                    disabled={updateEstadoMutation.isPending}
                                                >
                                                    <span>Reabrir Proyecto</span>
                                                </AlertDialogAction>
                                                <AlertDialogCancel>
                                                    <span>Cancelar</span>
                                                </AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                );
                            default:
                                return null;
                        }
                    })()}
                </div>
            ),
        }),
    ], [updateEstadoMutation.isPending]);

    const table = useReactTable({
        data: proyectosFiltrados,
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

    const handleViewDetail = (proyecto: Proyecto) => {
        setProyectoSeleccionado(proyecto);
        setModalOpen(true);
    };

    const handleEdit = (proyecto: Proyecto) => {
        setProyectoSeleccionado(proyecto);
        setModalOpen(true);
    };

    const handleToggleEstado = async (proyecto: Proyecto) => {
        try {
            const estadoActual = proyecto.Estado?.Id_Estado_Proyecto;
            let nuevoEstadoId: number;

            // Lógica de transición de estados
            switch (estadoActual) {
                case 1: // En Planeamiento -> En Progreso
                    nuevoEstadoId = 2;
                    break;
                case 2: // En Progreso -> Terminado
                    nuevoEstadoId = 3;
                    break;
                case 3: // Terminado -> En Progreso (reabrir)
                    nuevoEstadoId = 2;
                    break;
                default:
                    nuevoEstadoId = 1; // fallback
            }

            await updateEstadoMutation.mutateAsync({
                id: proyecto.Id_Proyecto,
                nuevoEstadoId,
            });
        } catch (error) {
            console.error('Error al cambiar estado del proyecto:', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setProyectoSeleccionado(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Cargando proyectos...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 p-4">
                Error al cargar los proyectos. Por favor, intenta nuevamente.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Encabezado con filtro de estado, búsqueda y botón */}
            <div className="bg-white rounded-lg p-3">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor='estado' className="text-sm font-medium text-gray-700">Estado:</label>
                        <select
                            id='estado'
                            value={estadoFilter}
                            onChange={(e) => setEstadoFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                            <option value="Todos">Todos los proyectos</option>
                            <option value="En Planeamiento">En Planeamiento</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="Terminado">Terminado</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar proyectos..."
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
                            Nuevo Proyecto
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
                                        {globalFilter ? 'No se encontraron proyectos que coincidan con la búsqueda' : 'No hay proyectos registrados'}
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

            {/* Modal para editar */}
            {modalOpen && proyectoSeleccionado && (
                <ProyectoModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        setProyectoSeleccionado(null);
                    }}
                    proyecto={proyectoSeleccionado}
                    refetch={refetch}
                />
            )}

            {/* Formulario para crear */}
            {formVisible && (
                <FormularioProyecto
                    id={0}
                    tituloInicial=""
                    descripcionInicial=""
                    onClose={() => setFormVisible(false)}
                    refetch={refetch}
                />
            )}
        </div>
    );
}
