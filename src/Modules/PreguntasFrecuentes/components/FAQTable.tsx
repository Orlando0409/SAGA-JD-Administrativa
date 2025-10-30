import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, MessageSquare } from "lucide-react";
import { useFAQ } from "../Hook/FAQHook";
import type { FAQ } from "../Models/FAQModels";

import FAQForm from "./FAQForm";
import FAQModal from "./FAQModal";

export default function FAQTable() {
    const {
        faqs,
        loading,
        error,
        fetchAll,
        removeFAQ,
        toggleVisible,
    } = useFAQ(true); // true = modo admin

    const [modalOpen, setModalOpen] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [faqSeleccionada, setFaqSeleccionada] = useState<FAQ | null>(null);

    const handleOpenModal = (faq: FAQ) => {
        setFaqSeleccionada(faq);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFaqSeleccionada(null);
    };

    const handleToggleVisible = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        await toggleVisible(id);
    };

    const handleDelete = async (faq: FAQ) => {
        if (confirm(`¿Seguro que deseas eliminar la pregunta "${faq.Pregunta}"?`)) {
            await removeFAQ(faq.Id_FAQ);
            fetchAll(); // Refresca la tabla
        }
    };

    return (
        <div className="w-full">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
                        Gestión de Preguntas Frecuentes (FAQ)
                    </h2>
                </div>
                <button
                    onClick={() => setFormVisible(true)}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Crear Pregunta
                </button>
            </div>

            {/* Mostrar errores */}
            {error && <div className="text-red-600 mb-2">{error}</div>}

            {/* Tabla FAQ */}
            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        <tr className="text-left text-xs sm:text-sm text-sky-700">
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Pregunta</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Respuesta</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha creación</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Actualización</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Visibilidad</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {(() => {
                            if (loading) {
                                return (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-slate-500 text-sm">
                                            Cargando...
                                        </td>
                                    </tr>
                                );
                            }

                            if (!faqs || faqs.length === 0) {
                                return (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-slate-500 text-sm">
                                            No hay preguntas registradas.
                                        </td>
                                    </tr>
                                );
                            }

                            return faqs.map((faq) => (
                                <tr
                                    key={faq.Id_FAQ}
                                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                                        <MessageSquare size={18} className="text-sky-600" />
                                        {faq.Pregunta.length > 40
                                            ? `${faq.Pregunta.slice(0, 40)}...`
                                            : faq.Pregunta}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        {faq.Respuesta.length > 10
                                            ? `${faq.Respuesta.slice(0, 10)}...`
                                            : faq.Respuesta}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                                        {new Date(faq.Fecha_Creacion).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                                        {faq.Fecha_Actualizacion
                                            ? new Date(faq.Fecha_Actualizacion).toLocaleDateString("es-ES")
                                            : "Sin cambios"}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                                        <button
                                            onClick={(e) => handleToggleVisible(e, faq.Id_FAQ)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${faq.Visible
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                        >
                                            {faq.Visible ? (
                                                <>
                                                    <Eye size={14} />
                                                    Visible
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={14} />
                                                    Oculto
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                                        <div className="flex items-center gap-2">

                                             <button
                                                className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                                                onClick={() => handleOpenModal(faq)}
                                                title="Ver detalles"
                                            >
                                                Ver
                                            </button>

                                            {/* Editar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFaqSeleccionada(faq);
                                                    setFormVisible(true);
                                                }}
                                                 className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                                title="Editar pregunta"
                                            >
                                                 Editar  
                                            </button>

                                            {/* Eliminar */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(faq);
                                                }}
                                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                                                title="Eliminar pregunta"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>

            {/* Modal FAQ */}
            {modalOpen && faqSeleccionada && (
                <FAQModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    faq={faqSeleccionada}
                />
            )}

            {/* Formulario FAQ */}
            {formVisible && (
                <FAQForm
                    onClose={() => {
                        setFormVisible(false);
                        setFaqSeleccionada(null);
                        fetchAll();
                    }}
                    refetch={fetchAll}
                />
            )}
            {/* Formulario edit FAQ */}
            {formVisible && faqSeleccionada && (
                <FAQForm
                    onClose={() => {
                        setFormVisible(false);
                        setFaqSeleccionada(null);
                        fetchAll();
                    }}
                    refetch={fetchAll}
                    initialData={faqSeleccionada}
                />
            )}

        </div>
    );
}
