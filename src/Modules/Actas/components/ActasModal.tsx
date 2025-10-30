import { Trash, FileText, Edit, Calendar, RefreshCcw } from "lucide-react";
import type { Acta, ArchivoActa } from "../Models/ActasModels";
import { useUpdateActa } from "../Hook/hookActas";
import { useState } from "react";
import { ActaSchema } from "../Schemas/ActasSchemas";
import z from "zod";

interface ActasModalProps {
    isOpen: boolean;
    onClose: () => void;
    acta: Acta;
    onEliminar: (id: number) => Promise<void>;
}

const ActasModal = ({ isOpen, onClose, acta, onEliminar }: ActasModalProps) => {
    const updateActaMutation = useUpdateActa(); // Hook para actualizar actas

    const [isEditing, setIsEditing] = useState(false); // Controla el modo de edición
    const [titulo, setTitulo] = useState(acta.Titulo);
    const [descripcion, setDescripcion] = useState(acta.Descripcion);
    const [files, setFiles] = useState<File[]>([]);
    const [tituloError, setTituloError] = useState(""); // Validación de título
    const [descripcionError, setDescripcionError] = useState(""); // Validación de descripción

    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitulo(value);

        if (acta && isEditing) {
            // Durante la edición, validar que el título sea diferente al original
            if (value.trim() === "") {
                setTituloError("El título es obligatorio");
            } else if (value.trim() === acta.Titulo) {
                setTituloError("Debes cambiar el título para poder actualizar");
            } else if (value.length < 5) {
                setTituloError("El título debe tener al menos 5 caracteres");
            } else if (value.length > 100) {
                setTituloError("El título no puede exceder los 100 caracteres");
            } else {
                setTituloError("");
            }
        } else {
            // Durante la creación
            if (value.trim() === "") {
                setTituloError("El título es obligatorio");
            } else if (value.length < 5) {
                setTituloError("El título debe tener al menos 5 caracteres");
            } else if (value.length > 100) {
                setTituloError("El título no puede exceder los 100 caracteres");
            } else {
                setTituloError("");
            }
        }
    };

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);
        if (!value.trim()) {
            setDescripcionError("Debe ingresar una descripción.");
        } else if (value.length < 10) {
            setDescripcionError("La descripción debe tener al menos 10 caracteres.");
        } else if (value.length > 200) {
            setDescripcionError("La descripción no puede exceder los 200 caracteres.");
        } else {
            setDescripcionError("");
        }
    };

    const handleActualizar = async () => {
        try {
            // Validar que el título haya cambiado
            if (titulo.trim() === "" || titulo.trim() === acta.Titulo) {
                setTituloError(titulo.trim() === "" ? "El título es obligatorio" : "Debes cambiar el título para poder actualizar");
                return;
            }

            // Validar los datos con Zod
            ActaSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Id_Usuario: 1, // Reemplaza con el ID dinámico del usuario
            });

            const formData = new FormData();
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            files.forEach((file) => {
                formData.append("Archivo", file); // El backend espera "Archivo" para cada archivo
            });

            await updateActaMutation.mutateAsync({ id: acta.Id_Acta, formData });
            alert("Acta actualizada con éxito.");
            setIsEditing(false); // Salir del modo de edición
            onClose(); // Cierra el modal
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message); // Muestra el primer error de validación
            } else {
                console.error("Error inesperado:", error);
                alert("Hubo un problema al actualizar el acta.");
            }
        }
    };

    const handleEliminar = async () => {
        try {
            await onEliminar(acta.Id_Acta); // Llama a la función para eliminar el acta
            alert("Acta eliminada con éxito.");
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al eliminar el acta:", error);
            alert("Hubo un problema al eliminar el acta.");
        }
    };

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
                    {isEditing ? (
                        <>
                            {/* Campo de Título */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título</label>
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={titulo}
                                    onChange={handleTituloChange}
                                    maxLength={100}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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
                                <label className="block text-sm font-medium text-gray-700">Archivos</label>

                                {/* Mostrar archivo actual y opción de reemplazar */}
                                {acta.Archivos.length > 0 ? (
                                    <div className="space-y-2">
                                        {acta.Archivos.map((archivo: ArchivoActa, index) => (
                                            <div key={archivo.Id_Archivo_Acta} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                                <FileText size={16} className="text-blue-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-700">
                                                        Archivo_{index + 1}.pdf
                                                    </p>
                                                    <a
                                                        href={archivo.Url_Archivo}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Ver archivo actual
                                                    </a>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => {
                                                            const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                                                            setFiles(selectedFiles);
                                                        }}
                                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                                    >
                                                        Reemplazar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {files.length > 0 && (
                                            <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                                                {files.length} nuevo{files.length > 1 ? 's' : ''} archivo{files.length > 1 ? 's' : ''} seleccionado{files.length > 1 ? 's' : ''}: {files.map(f => f.name).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Si no hay archivos actuales, mostrar selector normal */
                                    <div className="relative">
                                        <input
                                            id="archivos"
                                            type="file"
                                            accept="application/pdf"
                                            multiple
                                            onChange={(e) => {
                                                const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                                                setFiles(selectedFiles);
                                            }}
                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                        />
                                        <div className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 bg-white cursor-pointer">
                                            {files.length > 0
                                                ? files.map((f) => f.name).join(", ")
                                                : "Seleccionar archivos"}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
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
                                {acta.Fecha_Creacion && (
                                    <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                        <RefreshCcw size={18} className="text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">Fecha de edición</h4>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Botones */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)} // Cancelar edición
                                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleActualizar} // Actualizar acta
                                className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
                                disabled={updateActaMutation.status === "pending"}
                            >
                                {updateActaMutation.status === "pending" ? "Actualizando..." : "Guardar"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)} // Activar modo de edición
                                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Edit size={18} />
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={handleEliminar} // Eliminar acta
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <Trash size={18} />
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActasModal;