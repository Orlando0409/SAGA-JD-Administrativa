import { useState, useEffect } from "react";
import { useUpdateProyecto, useToggleVisibilidadProyecto } from "../Hook/HookProyecto";

import { ProyectoUpdateSchema } from "../schemas/Proyecto";
import { z } from "zod";
import { Calendar, RefreshCcw, Eye, EyeOff } from "lucide-react";
import type { Proyecto } from "../Models/ProyectoModels";

interface ProyectoModalProps {
    isOpen: boolean;
    onClose: () => void;
    proyecto: Proyecto;
    refetch: () => void;
}

export default function ProyectoModal({ isOpen, onClose, proyecto, refetch }: ProyectoModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [titulo, setTitulo] = useState(proyecto.Titulo);
    const [descripcion, setDescripcion] = useState(proyecto.Descripcion);
    const [imagen, setImagen] = useState<File | null>(null);

    const updateProyectoMutation = useUpdateProyecto();
    const toggleVisibilidad = useToggleVisibilidadProyecto();

    useEffect(() => {
        setTitulo(proyecto.Titulo);
        setDescripcion(proyecto.Descripcion);
        setImagen(null);
        setIsEditing(false);
    }, [proyecto]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            ProyectoUpdateSchema.parse({
                Id_Proyecto: proyecto.Id_Proyecto,
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Imagen_Url: imagen || undefined
            });

            const proyectoData = {
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Imagen_Url: imagen || null
            };

            await updateProyectoMutation.mutateAsync({ id: proyecto.Id_Proyecto, formData: proyectoData });
            alert("Proyecto actualizado con éxito.");
            refetch();
            setIsEditing(false);
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message);
            } else {
                console.error("Error al actualizar proyecto:", error);
                alert("Hubo un problema al actualizar el proyecto.");
            }
        }
    };

    const handleToggleVisibility = () => {
        toggleVisibilidad.mutate(proyecto.Id_Proyecto, { onSuccess: () => refetch() });
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? "Editar Proyecto" : "Detalles del Proyecto"}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    maxLength={100}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                    required
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{titulo.length}/100</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    maxLength={1000}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                                    rows={4}
                                    required
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/1000</div>
                            </div>
                            <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700">Estado del Proyecto</h4>
                                <p className="text-sm font-bold text-gray-800">{proyecto.Estado?.Nombre_Estado || "Sin estado"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        onChange={(e) => setImagen(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 bg-white cursor-pointer">
                                        {imagen ? imagen.name : "Seleccionar archivo (PNG, JPG, JPEG, HEIC, PDF)"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <div className="text-lg font-bold text-gray-800 break-words">{proyecto.Titulo}</div>
                                <div className="text-sm text-gray-700 mt-2 break-words">{proyecto.Descripcion || "Sin descripción disponible"}</div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-600" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                                        <p className="text-sm font-bold text-gray-800">{new Date(proyecto.Fecha_Creacion).toLocaleDateString("es-ES")}</p>
                                    </div>
                                </div>
                                {proyecto.Fecha_Actualizacion && (
                                    <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                        <RefreshCcw size={18} className="text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">Fecha de actualización</h4>
                                            <p className="text-sm font-bold text-gray-800">{new Date(proyecto.Fecha_Actualizacion).toLocaleDateString("es-ES")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2">
                                    {proyecto.Visible ? (
                                        <>
                                            <Eye size={18} className="text-green-600" />
                                            <span className="text-sm font-semibold text-green-700">Visible</span>
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff size={18} className="text-red-600" />
                                            <span className="text-sm font-semibold text-red-700">Oculto</span>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleToggleVisibility}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${proyecto.Visible ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                >
                                    {proyecto.Visible ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm text-sm">
                                    Editar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
