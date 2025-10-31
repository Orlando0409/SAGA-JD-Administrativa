import { useState, useEffect } from "react";
import { useCreateActa } from "../Hook/hookActas";
import { FaFilePdf, FaTimes } from "react-icons/fa";
import { Alert } from '@/Modules/Global/components/Alert/ui/Alert';

interface FormularioCrearActasProps {
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}

export default function FormularioCrearActas({ onClose, refetch }: FormularioCrearActasProps) {
    const createActaMutation = useCreateActa(); // Crear una nueva acta

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [tituloError, setTituloError] = useState(""); // Validación de título
    const [descripcionError, setDescripcionError] = useState(""); // Validación de descripción
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        title: string;
        description?: string;
    } | null>(null);

    useEffect(() => {
        if (!notification) return;
        const t = setTimeout(() => setNotification(null), 3500);
        return () => clearTimeout(t);
    }, [notification]);

    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitulo(value);
        if (value.length < 5) {
            setTituloError("El título debe tener al menos 5 caracteres.");
        } else if (value.length > 100) {
            setTituloError("El título no puede exceder los 100 caracteres.");
        } else {
            setTituloError("");
        }
    };

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);
        if (value.length < 10) {
            setDescripcionError("La descripción debe tener al menos 10 caracteres.");
        } else if (value.length > 200) {
            setDescripcionError("La descripción no puede exceder los 200 caracteres.");
        } else {
            setDescripcionError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (files.length === 0) {
            setNotification({ type: 'error', title: 'Debe seleccionar al menos un archivo válido.' });
            return;
        }

        const formData = new FormData();
        formData.append("Titulo", titulo.trim());
        formData.append("Descripcion", descripcion.trim());
        files.forEach((file) => {
            formData.append("Archivo", file); // El backend espera "Archivo" para cada archivo
        });

        createActaMutation.mutate(formData, {
            onSuccess: () => {
                setTitulo("");
                setDescripcion("");
                setFiles([]);
                refetch(); // Refresca la tabla para mostrar la nueva acta
                setNotification({ type: 'success', title: 'Acta creada con éxito.' });
               
                setTimeout(() => onClose(), 500);
            },
            onError: (error) => {
                console.error("Error al crear el acta:", error);
                setNotification({ type: 'error', title: 'Hubo un problema al crear el acta.' });
            },
        });
    };

    return (
    <>
        
        {notification && (
            <div className="fixed top-4 right-4 z-[200]">
                <Alert
                    type={notification.type === 'success' ? 'success' : (notification.type === 'error' ? 'error' : 'info')}
                    title={notification.title}
                    description={notification.description}
                    onClose={() => setNotification(null)}
                />
            </div>
        )}

        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4 transition-all duration-200"
            >
                <h3 className="text-lg font-semibold text-gray-800">Crear Acta</h3>

               
                {/* Campo de Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        placeholder="Título"
                        value={titulo}
                        onChange={handleTituloChange}
                        maxLength={100}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {titulo.length}/100
                    </div>
                    {tituloError && (
                        <p className="text-xs text-red-500 mt-1">{tituloError}</p>
                    )}
                </div>

                {/* Campo de Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        maxLength={200}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        rows={3}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {descripcion.length}/200
                    </div>
                    {descripcionError && (
                        <p className="text-xs text-red-500 mt-1">{descripcionError}</p>
                    )}
                </div>

                {/* Campo de Archivos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Archivos PDF</label>
                    
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
                                Haz clic para elegir archivos PDF 
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
                        type="button"
                        onClick={onClose} // Oculta el modal
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm"
                        disabled={createActaMutation.isPending}
                    >
                        {createActaMutation.isPending ? "Subiendo..." : "Subir Acta"}
                    </button>
                </div>
            </form>
        </div>
    </>
    );
}