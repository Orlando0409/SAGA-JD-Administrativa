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

            // Crear FormData en lugar de objeto plano
            const formData = new FormData();
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            formData.append("Id_Estado_Proyecto", proyecto.Estado.Id_Estado_Proyecto.toString());
            
            // Solo agregar imagen si se seleccionó una nueva
            if (imagen instanceof File) {
                formData.append("imagen", imagen);
            }

            await updateProyectoMutation.mutateAsync({ 
                id: proyecto.Id_Proyecto, 
                formData 
            });
            
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
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#0ea5e9 #e0f2fe'
                }}
            >
             
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {isEditing ? "Editar Proyecto" : "Detalles del Proyecto"}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="p-4 space-y-4">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
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
                                    rows={3}
                                    required
                                />
                                <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/1000</div>
                            </div>
                            
                            <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700">Estado del Proyecto</h4>
                                <p className="text-sm font-bold text-gray-800">{proyecto.Estado?.Nombre_Estado || "Sin estado"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
                                
                                {/* Mostrar nombre del archivo actual si existe */}
                                {proyecto.Imagen_Url && !imagen && (
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-600 mb-1">Archivo actual:</p>
                                        <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700">
                                            {decodeURIComponent(proyecto.Imagen_Url.split('/').pop()?.split('?')[0] || 'Archivo del proyecto')}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        onChange={(e) => setImagen(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 bg-white cursor-pointer hover:bg-gray-50">
                                        {imagen ? imagen.name : "Cambiar archivo (PNG, JPG, JPEG, HEIC, PDF)"}
                                    </div>
                                </div>
                                
                                {imagen && (
                                    <p className="text-xs text-green-600 mt-1">
                                         Nuevo archivo seleccionado: {imagen.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4">
                                   <button 
                                    type="submit" 
                                    disabled={updateProyectoMutation.isPending}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateProyectoMutation.isPending ? "Guardando..." : "Guardar"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setImagen(null);
                                    }} 
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                                >
                                    Cancelar
                                </button>
                            
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                                <div className="text-lg font-bold text-gray-800 break-words">{proyecto.Titulo}</div>
                                <div className="text-sm text-gray-700 mt-2 break-words">{proyecto.Descripcion || "Sin descripción disponible"}</div>
                            </div>

                            {/* Archivo del proyecto */}
                            {proyecto.Imagen_Url && (
                                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Archivo del proyecto</h4>
                                    <a 
                                        href={proyecto.Imagen_Url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    >
                                    
                                        <span className="truncate">
                                            {decodeURIComponent(proyecto.Imagen_Url.split('/').pop()?.split('?')[0] || 'Archivo adjunto')}
                                        </span>
                                    </a>
                                </div>
                            )}

                            <div className="flex gap-3 mt-3">
                                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 shadow-sm flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-600" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                                        <p className="text-sm font-bold text-gray-800">{new Date(proyecto.Fecha_Creacion).toLocaleDateString("es-ES")}</p>
                                    </div>
                                </div>
                                {proyecto.Fecha_Actualizacion && (
                                    <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 shadow-sm flex items-center gap-2">
                                        <RefreshCcw size={18} className="text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">Fecha de actualización</h4>
                                            <p className="text-sm font-bold text-gray-800">{new Date(proyecto.Fecha_Actualizacion).toLocaleDateString("es-ES")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-700">Estado del Proyecto</h4>
                                <p className="text-sm font-bold text-gray-800">{proyecto.Estado?.Nombre_Estado || "Sin estado"}</p>
                            </div>

                            <div className="flex items-center justify-between mt-3 p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
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
                                    disabled={toggleVisibilidad.isPending}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        proyecto.Visible 
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    {toggleVisibilidad.isPending 
                                        ? "Cambiando..." 
                                        : (proyecto.Visible ? "Ocultar" : "Mostrar")
                                    }
                                </button>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(true)} 
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm text-sm"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                     className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}