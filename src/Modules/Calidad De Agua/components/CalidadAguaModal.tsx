import { useState } from "react";
import { FileText, Trash, Upload } from "lucide-react";

interface CalidadAguaModalProps {
    isOpen: boolean;
    onClose: () => void;
    archivo: {
        Titulo: string;
        Url_Archivo: string;
        Id_Calidad_Agua: number;
    };
    onEliminar: (id: number) => void;
    onReemplazar: (id: number, formData: FormData) => Promise<void>;
}

const CalidadAguaModal = ({ isOpen, onClose, archivo, onEliminar, onReemplazar }: CalidadAguaModalProps) => {
    const [nuevoArchivo, setNuevoArchivo] = useState<File | null>(null);
    const [reemplazarActivo, setReemplazarActivo] = useState(false); // Estado para habilitar/deshabilitar el input
    const [mensajeExito, setMensajeExito] = useState<string | null>(null); // Estado para el mensaje de éxito
    const [mensajeError, setMensajeError] = useState<string | null>(null); // Estado para el mensaje de error

    if (!isOpen) return null;
    const handleEliminar = async () => {
        try {
            await onEliminar(archivo.Id_Calidad_Agua); // Llama a la función para eliminar el archivo
            setMensajeExito("Archivo eliminado con éxito."); // Muestra el mensaje de éxito
            setMensajeError(null); // Limpia cualquier mensaje de error
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al eliminar el archivo:", error);
            setMensajeError("Hubo un problema al eliminar el archivo. Intente nuevamente."); // Muestra el mensaje de error
        }
    };
    const handleReemplazar = async () => {
        if (!nuevoArchivo) {
            alert("Debe seleccionar un archivo para reemplazar.");
            return;
        }

        const formData = new FormData();
        formData.append("Archivo_Calidad_Agua", nuevoArchivo);
        formData.append("Titulo", archivo.Titulo); // Agrega el título al FormData

        try {
            console.log("FormData antes de enviar:", {
                Archivo_Calidad_Agua: formData.get("Archivo_Calidad_Agua"),
                Titulo: formData.get("Titulo"),
            });
            await onReemplazar(archivo.Id_Calidad_Agua, formData); // Llama a la función para reemplazar el archivo
            setNuevoArchivo(null); // Limpia el archivo seleccionado
            setReemplazarActivo(false); // Desactiva el input después de reemplazar
            setMensajeExito("Archivo reemplazado con éxito."); // Muestra el mensaje de éxito
            setMensajeError(null); // Limpia cualquier mensaje de error
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al reemplazar el archivo:", error);
            setMensajeError("Hubo un problema al reemplazar el archivo. Intente nuevamente."); // Muestra el mensaje de error
        }
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del Archivo</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">✕</div>
                    </button>
                </div>

                {/* Mensaje de éxito */}
                {mensajeExito && (
                    <div className="p-4 bg-green-100 text-green-700 rounded-lg mb-4">
                        {mensajeExito}
                    </div>
                )}

                {/* Mensaje de error */}
                {mensajeError && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                        {mensajeError}
                    </div>
                )}

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    {/* Título */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Título:</h3>
                        <p className="text-gray-600">{archivo.Titulo}</p>
                    </div>

                    {/* Archivo PDF */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Archivo:</h3>
                        <a
                            href={archivo.Url_Archivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                            <FileText size={24} className="text-red-500" /> {/* Ícono de PDF */}
                            Ver archivo PDF
                        </a>
                    </div>

                    {/* Reemplazar archivo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reemplazar archivo:
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setNuevoArchivo(e.target.files?.[0] || null)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${reemplazarActivo
                                ? "border-blue-500 bg-blue-50 text-blue-700 cursor-pointer"
                                : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                                }`}
                            disabled={!reemplazarActivo}
                        />
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
                    <button
                        type="button"
                        onClick={() => setReemplazarActivo(true)}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <Upload size={18} />
                        Reemplazar
                    </button>
                    {reemplazarActivo && (
                        <button
                            type="button"
                            onClick={handleReemplazar}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            Confirmar reemplazo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalidadAguaModal;
//ya sirve 