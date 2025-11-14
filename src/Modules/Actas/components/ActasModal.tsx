import { FileText, Calendar, RefreshCcw } from "lucide-react";
import type { Acta, ArchivoActa } from "../Models/ActasModels";

interface ActasModalProps {
    isOpen: boolean;
    onClose: () => void;
    acta: Acta;
}

const ActasModal = ({ isOpen, onClose, acta }: ActasModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del Acta</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Tarjeta principal */}
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                        <div
                            className="text-lg font-bold text-gray-800 break-words"
                            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        >
                            {acta.Titulo}
                        </div>
                        <p
                            className="text-gray-600 mt-2 break-words"
                            style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        >
                            {acta.Descripcion}
                        </p>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-blue-600" />
                                Archivos Adjuntos
                            </h3>
                            {!acta?.Archivos || acta.Archivos.length === 0 ? (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-3">
                                        <FileText size={24} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">No hay archivos disponibles</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {acta.Archivos.map((archivo: ArchivoActa, index: number) => (
                                        <div
                                            key={archivo.Id_Archivo_Acta || index}
                                            className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-400 transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="relative">
                                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                                            <FileText size={24} className="text-white" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                                                            Archivo {index + 1}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
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
                                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                    Ver
                                                </a>
                                            </div>
                                            {/* Efecto de brillo al hover */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shimmer pointer-events-none"></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                            <Calendar size={18} className="text-gray-600" />
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                                <p className="text-sm font-bold text-gray-800">
                                    {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                                </p>
                            </div>
                        </div>
                        {acta.Fecha_Actualizacion && (
                            <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                <RefreshCcw size={18} className="text-gray-600" />
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700">Fecha de edición</h4>
                                    <p className="text-sm font-bold text-gray-800">
                                        {new Date(acta.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botón cerrar */}
                <div className="flex justify-end p-6 border-t border-gray-200">
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

export default ActasModal;