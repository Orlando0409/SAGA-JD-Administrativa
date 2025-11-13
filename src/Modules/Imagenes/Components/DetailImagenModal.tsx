import { useState, useEffect } from "react";
import { Calendar, RefreshCcw, Image as ImageIcon } from "lucide-react";
import type { Imagen } from "../Models/ModelsEdiImagen";

interface ImagenModalProps {
    isOpen: boolean;
    onClose: () => void;
    imagen: Imagen;
}

const ImagenModal = ({ isOpen, onClose, imagen }: ImagenModalProps) => {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setIsEditing(false);
    }, [imagen]);

    if (!isOpen) return null;


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
                </div>
                     <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cerrar
                        </button>
                        </div>
            </div>
        </div>
    );
};

export default ImagenModal;
