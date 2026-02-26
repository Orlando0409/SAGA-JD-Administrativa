import { useEffect } from "react";
import { useToggleVisibilidadCalidadAgua } from "../Hook/HookCalidadAgua";
import { FileText, Calendar, RefreshCcw, Eye, EyeOff, X } from "lucide-react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";

interface CalidadAguaModalProps {
    isOpen: boolean;
    onClose: () => void;
    archivo: {
        Id_Calidad_Agua: number;
        Titulo: string;
        Url_Archivo: string;
        Fecha_Creacion: string;
        Fecha_Actualizacion?: string;
        Descripcion: string;
        Visible: boolean;
        Usuario_Creador: {
            Id_Usuario: number;
            Nombre_Usuario: string;
            Id_Rol: number;
            Nombre_Rol: string;
        };
    };
    refetch: () => void;
}

const CalidadAguaModal = ({ isOpen, onClose, archivo, refetch }: CalidadAguaModalProps) => {
    const toggleVisibilidad = useToggleVisibilidadCalidadAgua();
    const { showSuccess, showError } = useAlerts();

    useEffect(() => {
        // Reset any state if needed
    }, [archivo]);

    if (!isOpen) return null;

    const handleToggleVisibility = () => {
        toggleVisibilidad.mutate(archivo.Id_Calidad_Agua, {
            onSuccess: () => {
                refetch();
                showSuccess(
                    archivo.Visible
                        ? "El archivo ahora está oculto."
                        : "El archivo ahora es visible."
                );
            },
            onError: () => {
                showError("Error al cambiar la visibilidad del archivo.");
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del Registro</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                    {/* Tarjeta principal */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <div
                            className="text-lg font-bold text-gray-800 break-words"
                            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        >
                            {archivo.Titulo}
                        </div>
                        <p
                            className="text-gray-600 mt-2 break-words"
                            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        >
                            {archivo.Descripcion?.trim() || "Sin descripción disponible"}
                        </p>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                
                                Archivo Adjunto
                            </h3>
                            <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-400 transition-all duration-300 hover:-translate-y-0.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="relative">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                                <FileText size={24} className="text-white" />
                                            </div>

                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                Documento de Calidad de Agua
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">

                                                Documento PDF
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={archivo.Url_Archivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 group/btn"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="group-hover/btn:scale-110 transition-transform"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        Ver
                                    </a>
                                </div>
                                {/* Efecto de brillo al hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    {/* Toggle de visibilidad */}
                    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {archivo.Visible ? (
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
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${archivo.Visible
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                disabled={toggleVisibilidad.isPending}
                            >
                                {toggleVisibilidad.isPending
                                    ? 'Cambiando...'
                                    : archivo.Visible
                                        ? 'Ocultar'
                                        : 'Mostrar'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            {archivo.Visible
                                ? 'Este archivo es visible para los usuarios públicos'
                                : 'Este archivo está oculto y no aparece en la vista pública'}
                        </p>
                    </div>

                    {/* Fechas */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                            <Calendar size={18} className="text-gray-600" />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                                <p className="text-sm font-bold text-gray-800">
                                    {new Date(archivo.Fecha_Creacion).toLocaleDateString("es-ES")}
                                </p>
                            </div>
                        </div>
                        {archivo.Fecha_Actualizacion && (
                            <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                <RefreshCcw size={18} className="text-gray-600" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700">Fecha de edición</h4>
                                    <p className="text-sm font-bold text-gray-800">
                                        {new Date(archivo.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botón cerrar */}
                <div className="sticky bottom-0 flex justify-end p-6 border-t border-gray-200 bg-white z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalidadAguaModal;
