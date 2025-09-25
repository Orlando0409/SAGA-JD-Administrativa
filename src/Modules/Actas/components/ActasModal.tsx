import { Trash, FileText } from "lucide-react";
import type { Acta, ArchivoActa } from "../Models/ActasModels";

interface ActasModalProps {
    isOpen: boolean;
    onClose: () => void;
    acta: Acta;
    onEliminar: (id: number) => Promise<void>;
}

const ActasModal = ({ isOpen, onClose, acta, onEliminar }: ActasModalProps) => {
    if (!isOpen) return null;

    const handleEliminar = async () => {
        try {
            await onEliminar(acta.Id_Acta); // Llama a la función para eliminar el acta
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al eliminar el acta:", error);
            alert("Hubo un problema al eliminar el acta.");
        }
    };

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
                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">✕</div>
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    {/* Título */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Título:</h3>
                        <p className="text-gray-600">{acta.Titulo}</p>
                    </div>

                    {/* Descripción */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Descripción:</h3>
                        <p className="text-gray-600">{acta.Descripcion}</p>
                    </div>

                    {/* Fecha de creación */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Fecha de creación:</h3>
                        <p className="text-gray-600">
                            {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                        </p>
                    </div>

                    {/* Archivos asociados */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Archivos:</h3>
                        {acta.Archivos.map((archivo: ArchivoActa) => (
                            <a
                                key={archivo.Id_Archivo_Acta}
                                href={archivo.Url_Archivo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-2"
                            >
                                <FileText size={24} className="text-red-500" />
                                Ver archivo PDF
                            </a>
                        ))}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleEliminar}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Trash size={18} />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActasModal;