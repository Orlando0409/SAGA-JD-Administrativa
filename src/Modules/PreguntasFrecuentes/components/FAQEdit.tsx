import { useState, useEffect } from "react";
import { useFAQ } from "../Hook/FAQHook";
import { FaFilePdf, FaTimes } from "react-icons/fa";
import type { FAQ } from "../Models/FAQModels";

interface FAQEditProps {
    faq: FAQ;
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}

export default function FAQEdit({ faq, onClose, refetch }: FAQEditProps) {
    const { editFAQ, loading } = useFAQ(true);

    const [pregunta, setPregunta] = useState(faq.Pregunta);
    const [respuesta, setRespuesta] = useState(faq.Respuesta);
    const [files, setFiles] = useState<File[]>([]);
    const [preguntaError, setPreguntaError] = useState(""); // Validación de pregunta
    const [respuestaError, setRespuestaError] = useState(""); // Validación de respuesta

    // Pre-cargar los valores de la FAQ cuando se monta el componente
    useEffect(() => {
        setPregunta(faq.Pregunta);
        setRespuesta(faq.Respuesta);
    }, [faq]);

    const handlePreguntaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPregunta(value);
        if (value.length < 5) {
            setPreguntaError("La pregunta debe tener al menos 5 caracteres.");
        } else if (value.length > 200) {
            setPreguntaError("La pregunta no puede exceder los 200 caracteres.");
        } else {
            setPreguntaError("");
        }
    };

    const handleRespuestaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setRespuesta(value);
        if (value.length < 10) {
            setRespuestaError("La respuesta debe tener al menos 10 caracteres.");
        } else if (value.length > 1000) {
            setRespuestaError("La respuesta no puede exceder los 1000 caracteres.");
        } else {
            setRespuestaError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Pregunta", pregunta.trim());
        formData.append("Respuesta", respuesta.trim());

        // Solo agregar archivos si se seleccionaron nuevos
        if (files.length > 0) {
            files.forEach((file) => {
                formData.append("Archivo", file);
            });
        }

        try {
            await editFAQ(faq.Id_FAQ, {
                Pregunta: pregunta.trim(),
                Respuesta: respuesta.trim(),
                // Aquí podrías agregar lógica para archivos si el backend lo soporta
            });
            alert("Pregunta actualizada con éxito.");
            refetch();
            onClose();
        } catch (error) {
            console.error("Error al actualizar la pregunta:", error);
            alert("Hubo un problema al actualizar la pregunta.");
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">Editar Pregunta Frecuente</h3>

                {/* Campo de Pregunta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pregunta</label>
                    <input
                        type="text"
                        placeholder="Pregunta"
                        value={pregunta}
                        onChange={handlePreguntaChange}
                        maxLength={200}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {pregunta.length}/200
                    </div>
                    {preguntaError && (
                        <p className="text-xs text-red-500 mt-1">{preguntaError}</p>
                    )}
                </div>

                {/* Campo de Respuesta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Respuesta</label>
                    <textarea
                        placeholder="Respuesta"
                        value={respuesta}
                        onChange={handleRespuestaChange}
                        maxLength={1000}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        rows={4}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {respuesta.length}/1000
                    </div>
                    {respuestaError && (
                        <p className="text-xs text-red-500 mt-1">{respuestaError}</p>
                    )}
                </div>

                {/* Campo de Archivos (opcional para edición) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Archivos PDF (opcional - reemplazar archivos existentes)
                    </label>

                    {/* Botón para seleccionar múltiples archivos */}
                    <div className="relative">
                        <input
                            id="archivos"
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={(e) => {
                                const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                                if (selectedFiles.length > 0) {
                                    // Agregar nuevos archivos a los existentes, evitando duplicados
                                    setFiles(prevFiles => {
                                        const newFiles = [...prevFiles];
                                        selectedFiles.forEach(newFile => {
                                            const isDuplicate = newFiles.some(existingFile =>
                                                existingFile.name === newFile.name &&
                                                existingFile.size === newFile.size
                                            );
                                            if (!isDuplicate) {
                                                newFiles.push(newFile);
                                            }
                                        });
                                        return newFiles;
                                    });
                                }
                                // Limpiar el input para poder seleccionar los mismos archivos otra vez
                                e.target.value = '';
                            }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <button
                            type="button"
                            className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-sky-300 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer flex flex-col items-center gap-2"
                        >
                            <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sky-600 font-medium">
                                {files.length > 0 ? "Agregar Más Archivos" : "Seleccionar Archivos PDF"}
                            </span>
                            <span className="text-xs text-gray-500">
                                Opcional - Solo si deseas reemplazar archivos
                            </span>
                        </button>
                    </div>

                    {/* Lista de archivos seleccionados */}
                    {files.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {files.length} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setFiles([])}
                                    className="text-xs text-red-600 hover:text-red-800"
                                >
                                    Eliminar todos los archivos
                                </button>
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between text-xs bg-white p-2 rounded border">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <FaFilePdf className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            <span className="truncate">{file.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(1)} MB
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                                                }}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                                            >
                                                <FaTimes className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                         <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm"
                        disabled={loading}
                    >
                        {loading ? "Actualizando..." : "Actualizar Pregunta"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose} // Oculta el modal
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                    >
                        Cancelar
                    </button>
               
                </div>
            </form>
        </div>
    );
}