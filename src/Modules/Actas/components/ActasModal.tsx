import { Trash, FileText, Edit } from "lucide-react";
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
    const [file, setFile] = useState<File | null>(null);

    const handleActualizar = async () => {
        try {
            // Validar los datos con zod
            ActaSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Id_Usuario: 1, // Reemplaza con el ID dinámico del usuario
            });
            const formData = new FormData();
            formData.append("Id_Usuario", "1"); // Incluye el ID del usuario (puedes reemplazar "1" con el ID dinámico)
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            if (file) {
                formData.append("Archivo", file);
            }

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
                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">✕</div>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                placeholder="Título del Acta"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                required
                            />
                            <textarea
                                placeholder="Descripción del Acta"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                rows={3}
                                required
                            />
                            <input
                                id="archivo"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) {
                                        setFile(selectedFile);
                                    } else {
                                        setFile(null);
                                    }
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                            />
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Título:</h3>
                                <p className="text-gray-600">{acta.Titulo}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Descripción:</h3>
                                <p className="text-gray-600">{acta.Descripcion}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Fecha de creación:</h3>
                                <p className="text-gray-600">
                                    {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                                </p>
                            </div>
                            {acta.Fecha_Creacion && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-700">Fecha de edición:</h3>
                                    <p className="text-gray-600">
                                        {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                                    </p>
                                </div>
                            )}
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
                        </>
                    )}
                </div>
                {/*botones */}
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
                                className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center gap-2"
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