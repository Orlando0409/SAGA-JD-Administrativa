import { useState, useEffect } from "react";
import { Calendar, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { Imagen } from "../Models/ModelsEdiImagen";
import ImagenFormEdit from "./ImagenFormEdit";

interface ImagenModalProps {
    isOpen: boolean;
    onClose: () => void;
    imagen: Imagen;
    refetch: () => void;
}

const ImagenModal = ({ isOpen, onClose, imagen, refetch }: ImagenModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { showSuccess } = useAlerts();

    useEffect(() => {
        setIsEditing(false);
    }, [imagen]);

    if (!isOpen) return null;

    const handleUpdateSuccess = () => {
        refetch();
        setIsEditing(false);
        showSuccess("Imagen actualizada correctamente.");
    };

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? "Editar Imagen" : "Detalles de la Imagen"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-slate-100 scrollbar-rounded">

                    {isEditing ? (
                        <ImagenFormEdit
                            imagen={imagen}
                            onClose={() => setIsEditing(false)}
                            refetch={handleUpdateSuccess}
                        />
                    ) : (
                        <>
                            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                                <div className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <ImageIcon className="text-sky-600" />
                                    {imagen.Nombre_Imagen}
                                </div>

                                {/* Contenedor adaptable */}
                                <div className="w-full flex justify-center">
                                    <div className="max-w-full bg-white rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                                        <img
                                            src={imagen.Imagen}
                                            alt={imagen.Nombre_Imagen}
                                            className="w-full h-auto object-contain max-h-[450px]"
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* Fechas */}
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-600" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">
                                            Fecha de creación
                                        </h4>
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Date(imagen.Fecha_Creacion).toLocaleDateString("es-ES")}
                                        </p>
                                    </div>
                                </div>

                                {imagen.Fecha_Actualizacion && (
                                    <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                        <RefreshCcw size={18} className="text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">
                                                Fecha de actualización
                                            </h4>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(imagen.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón Editar */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm text-sm"
                                >
                                    Editar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImagenModal;
