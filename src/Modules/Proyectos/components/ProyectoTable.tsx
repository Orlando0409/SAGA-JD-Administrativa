import { useState } from "react";
import {
    useGetProyectos,
    useToggleVisibilidadProyecto,
} from "../Hook/HookProyecto";

import { FileText, Plus, Eye, EyeOff, Edit3 } from "lucide-react";
import type { Proyecto } from "../Models/ProyectoModels";
import FormularioProyecto from "./ProyectoFormulario";
import ProyectoModal from "./ProyectoModal";


export default function ProyectoTable() {
    const { data: proyectos, isLoading, isError, refetch } = useGetProyectos();
    const toggleVisibilidad = useToggleVisibilidadProyecto();

   
    const [modalOpen, setModalOpen] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

    const handleOpenModal = (proyecto: Proyecto) => {
        setProyectoSeleccionado(proyecto);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setProyectoSeleccionado(null);
    };

    const handleToggleVisible = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        toggleVisibilidad.mutate(id);
    };

    console.log("ProyectoTable se está renderizando"); // Debug

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
                        Gestión de Proyectos
                    </h2>
                </div>
                <button
                    onClick={() => setFormVisible(true)}
                    className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    Crear Proyecto
                </button>
            </div>

            {isError && <div className="text-red-600 mb-2">Error al cargar los proyectos.</div>}

            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        <tr className="text-left text-xs sm:text-sm text-sky-700">
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de actualización</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Visibilidad</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    Cargando...
                                </td>
                            </tr>
                        ) : proyectos?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    No se encontraron proyectos.
                                </td>
                            </tr>
                        ) : (
                            proyectos?.map((proyecto) => (
                                <tr
                                    key={proyecto.Id_Proyecto}
                                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                                    onClick={() => handleOpenModal(proyecto)}
                                >
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                                        <FileText size={18} className="text-sky-600" />
                                        {proyecto.Titulo.length > 10
                                            ? `${proyecto.Titulo.slice(0, 10)}...`
                                            : proyecto.Titulo}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        {new Date(proyecto.Fecha_Creacion).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        {proyecto.Fecha_Actualizacion
                                            ? new Date(proyecto.Fecha_Actualizacion).toLocaleDateString("es-ES")
                                            : "No hay actualizaciones"}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        <button
                                            onClick={(e) => handleToggleVisible(e, proyecto.Id_Proyecto)}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${proyecto.Visible
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            disabled={toggleVisibilidad.isPending}
                                        >
                                            {proyecto.Visible ? (
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
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top text-center flex justify-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(proyecto);
                                            }}
                                            className="p-1 rounded hover:bg-sky-100 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit3 size={16} className="text-sky-600" />
                                        </button>
                                        
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para editar */}
            {modalOpen && proyectoSeleccionado && (
                <ProyectoModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
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
