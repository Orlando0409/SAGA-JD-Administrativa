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
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del Registro</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <div
                            className="text-lg font-bold text-gray-800 break-words"
                            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        >
                            {archivo.Titulo}
                        </div>

                        <a
                            href={archivo.Url_Archivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 inline-flex items-center gap-2"
                        >
                            <FileText size={18} />
                            Ver archivo PDF
                        </a>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
                        <div className="text-sm text-gray-800 break-words">
                            {archivo.Descripcion?.trim() || "Sin descripción disponible"}
                        </div>
                    </div>

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
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    archivo.Visible
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
                                    <h4 className="text-sm font-semibold text-gray-700">Fecha de actualización</h4>
                                    <p className="text-sm font-bold text-gray-800">
                                        {new Date(archivo.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalidadAguaModal;
