import { useMemo, useState } from "react";
import { useGetActas, useDeleteActa } from "../Hook/hookActas";
import { FileText, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Acta } from "../Models/ActasModels";
import FormularioCrearActas from "./FormularioCrearActas";
import ActasModal from "./ActasModal";
//funciona 
export default function ActasTable() {
    const { data: actas, isLoading, refetch } = useGetActas(); // Obtener todas las actas
    const deleteActaMutation = useDeleteActa(); // Eliminar una acta

    const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal de creación
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null); // Acta seleccionada para el modal de detalles

    // Estados para búsqueda y paginación
    const [searchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtra actas por título usando useMemo para optimizar
    const filteredActas = useMemo(() => {
        if (!actas) return [];

        if (!searchText.trim()) {
            return actas; // Si no hay búsqueda, devolver todas las actas
        }

        // Filtrar por título (case-insensitive)
        return actas.filter(acta =>
            acta.Titulo.toLowerCase().includes(searchText.toLowerCase().trim())
        );
    }, [actas, searchText]);

    // Calcula datos de paginación
    const paginationData = useMemo(() => {
        const totalItems = filteredActas.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentItems = filteredActas.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            currentItems,
            startIndex,
            endIndex,
        };
    }, [filteredActas, currentPage, itemsPerPage]);

    //  Función para cambiar de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // unción para cambiar elementos por página
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset a la primera página
    };

    const handleEliminarActa = async (id: number) => {
        deleteActaMutation.mutate(id, {
            onSuccess: () => {
                refetch(); // Refresca la tabla después de eliminar el acta
                alert("Acta eliminada con éxito.");
            },
            onError: () => {
                alert("Hubo un problema al eliminar el acta.");
            },
        });
    };

    const handleOpenModalDetalles = (acta: Acta) => {
        setActaSeleccionada(acta); // Establece el acta seleccionada
    };

    const handleCloseModalDetalles = () => {
        setActaSeleccionada(null); // Cierra el modal de detalles
    };

    // Renderiza el contenido de la tabla según el estado
    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                        Cargando...
                    </td>
                </tr>
            );
        }

        if (paginationData.currentItems.length === 0) {
            return (
                <tr>
                    <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                        {(actas ?? []).length > 0
                            ? `No se encontraron actas con el título "${searchText}".`
                            : "No se encontraron registros."
                        }
                    </td>
                </tr>
            );
        }

        return paginationData.currentItems.map((acta) => (
            <tr
                key={acta.Id_Acta}
                className="hover:bg-sky-50 cursor-pointer transition-colors"
                onClick={() => handleOpenModalDetalles(acta)} // Abre el modal de detalles al hacer clic en la fila
            >
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                    <FileText size={18} className="text-sky-600" />
                    {acta.Titulo.length > 20
                        ? `${acta.Titulo.slice(0, 20)}...`
                        : acta.Titulo}
                </td>
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    {acta.Descripcion.length > 20
                        ? `${acta.Descripcion.slice(0, 20)}...`
                        : acta.Descripcion}
                </td>
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                </td>
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    {acta.Fecha_Actualizacion
                        ? new Date(acta.Fecha_Actualizacion).toLocaleDateString("es-ES")
                        : "Sin actualizar"}
                </td>
            </tr>
        ));
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto shadow-md rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
                        Gestión de Actas
                    </h2>
                    <button
                        onClick={() => setModalVisible(true)}
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Crear Acta
                    </button>
                </div>
                <table className="min-w-full divide-y divide-sky-100">


                    <thead className="bg-sky-50">
                        <tr className="text-left text-xs sm:text-sm text-sky-700">
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Descripción</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de actualización</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {renderTableContent()}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {paginationData.totalItems > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                    {/* Selector de elementos por página (lado izquierdo) */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <label htmlFor="Mostrar">Mostrar:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>por página</span>
                    </div>

                    {/* Información de página (lado derecho) */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>
                            Mostrando {paginationData.startIndex + 1} a {Math.min(paginationData.endIndex, paginationData.totalItems)} de {paginationData.totalItems} resultados
                        </span>
                    </div>

                    {/* Controles de paginación */}
                    {paginationData.totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            {/* Botón anterior */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-md transition-colors ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {/* Números de página */}
                            <div className="flex items-center gap-1">
                                {/* Primera página */}
                                {currentPage > 3 && (
                                    <>
                                        <button
                                            onClick={() => handlePageChange(1)}
                                            className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                        >
                                            1
                                        </button>
                                        {currentPage > 4 && <span className="text-gray-400">...</span>}
                                    </>
                                )}

                                {/* Páginas cercanas */}
                                {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                                    const pageStart = Math.max(1, Math.min(currentPage - 2, paginationData.totalPages - 4));
                                    const pageNumber = pageStart + i;

                                    if (pageNumber <= paginationData.totalPages) {
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-3 py-1 text-sm rounded-md transition-colors ${currentPage === pageNumber
                                                    ? 'bg-sky-600 text-white'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    }
                                    return null;
                                })}

                                {/* Última página */}
                                {currentPage < paginationData.totalPages - 2 && (
                                    <>
                                        {currentPage < paginationData.totalPages - 3 && <span className="text-gray-400">...</span>}
                                        <button
                                            onClick={() => handlePageChange(paginationData.totalPages)}
                                            className="px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors"
                                        >
                                            {paginationData.totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Botón siguiente */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === paginationData.totalPages}
                                className={`p-2 rounded-md transition-colors ${currentPage === paginationData.totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}


            {/* Modal para crear actas */}
            {modalVisible && (
                <FormularioCrearActas
                    onClose={() => setModalVisible(false)} // Oculta el modal de creación
                    refetch={refetch} // Refresca la tabla
                />
            )}

            {/* Modal para mostrar detalles del acta */}
            {actaSeleccionada && (
                <ActasModal
                    isOpen={!!actaSeleccionada} // Muestra el modal si hay un acta seleccionada
                    onClose={handleCloseModalDetalles} // Cierra el modal
                    acta={actaSeleccionada} // Pasa el acta seleccionada al modal
                    onEliminar={handleEliminarActa} // Función para eliminar el acta
                />
            )}
        </div>
    );
}