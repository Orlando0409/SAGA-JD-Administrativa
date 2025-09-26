import { useState } from "react";
import { useGetActas, useDeleteActa } from "../Hook/hookActas";
import { FileText, Plus } from "lucide-react";
import type { Acta } from "../Models/ActasModels";
import FormularioCrearActas from "./FormularioCrearActas";
import ActasModal from "./ActasModal";

export default function ActasTable() {
    const { data: actas, isLoading, isError, refetch } = useGetActas(); // Obtener todas las actas
    const deleteActaMutation = useDeleteActa(); // Eliminar una acta

    const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal de creación
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null); // Acta seleccionada para el modal de detalles

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

    return (
        <div className="w-full relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Actas</h2>
                </div>
                <button
                    onClick={() => setModalVisible(true)} // Muestra el modal de creación
                    className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Crear Acta
                </button>
            </div>

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

            {isError && <div className="text-red-600 mb-2">Error al cargar las actas.</div>}

            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        <tr className="text-left text-xs sm:text-sm text-sky-700">
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Descripción</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de actualización</th>

                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    Cargando...
                                </td>
                            </tr>
                        ) : actas?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        ) : (
                            actas?.map((acta) => (
                                <tr
                                    key={acta.Id_Acta}
                                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                                    onClick={() => handleOpenModalDetalles(acta)} // Abre el modal de detalles al hacer clic en la fila
                                >
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                                        <FileText size={18} className="text-sky-600" />
                                        {acta.Titulo}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}