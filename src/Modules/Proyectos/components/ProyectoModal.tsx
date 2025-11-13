import { useToggleVisibilidadProyecto } from "../Hook/HookProyecto";
import { Calendar, RefreshCcw, Eye, EyeOff } from "lucide-react";
import type { Proyecto } from "../Models/ProyectoModels";

interface ProyectoModalProps {
    isOpen: boolean;
    onClose: () => void;
    proyecto: Proyecto;
    refetch: () => void;
}

export default function ProyectoModal({ isOpen, onClose, proyecto, refetch }: ProyectoModalProps) {
    const toggleVisibilidad = useToggleVisibilidadProyecto();

    if (!isOpen) return null;

    const handleToggleVisibility = () => {
        toggleVisibilidad.mutate(proyecto.Id_Proyecto, { 
            onSuccess: () => refetch() 
        });
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Detalles del Proyecto</h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Título y Descripción */}
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

                        {/* Fechas */}
                        <div className="flex gap-3">
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

                        {/* Estado */}
                        <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-700">Estado del Proyecto</h4>
                            <p className="text-sm font-bold text-gray-800">{proyecto.Estado?.Nombre_Estado || "Sin estado"}</p>
                        </div>

                        {/* Visibilidad */}
                        <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
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

                        {/* Botones de acción */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
