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
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Archivos:</h3>
                            {acta?.Archivos?.map((archivo: ArchivoActa) => (
                                <a
                                    key={archivo.Id_Archivo_Acta}
                                    href={archivo.Url_Archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-2 mt-2"
                                >
                                    <FileText size={18} />
                                    Ver archivo PDF
                                </a>
                            ))}
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