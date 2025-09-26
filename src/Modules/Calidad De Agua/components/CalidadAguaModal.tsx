import { useState } from "react";
import { useUpdateCalidadAgua } from "../Hook/HookCalidadAgua";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";

interface CalidadAguaModalProps {
    isOpen: boolean; // Controla si el modal está abierto
    onClose: () => void; // Función para cerrar el modal
    archivo: {
        Id_Calidad_Agua: number;
        Titulo: string;
        Url_Archivo: string;
        Fecha_Creacion: string;
        Fecha_Actualizacion?: string;
    };
    refetch: () => void; // Función para refrescar la tabla
}

const CalidadAguaModal = ({ isOpen, onClose, archivo, refetch }: CalidadAguaModalProps) => {
    const [isEditing, setIsEditing] = useState(false); // Controla el modo de edición
    const [titulo, setTitulo] = useState(archivo.Titulo);
    const [file, setFile] = useState<File | null>(null);
    const updateCalidadAguaMutation = useUpdateCalidadAgua(); // Actualizar un archivo existente

    if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validar los datos con el esquema
            CalidadAguaSchema.parse({
                Titulo: titulo.trim(),
            });

            const formData = new FormData();
            formData.append("Titulo", titulo.trim());
            if (file) {
                formData.append("Archivo_Calidad_Agua", file); // Reemplaza el archivo existente
            }

            await updateCalidadAguaMutation.mutateAsync({ id: archivo.Id_Calidad_Agua, formData });
            alert("Registro actualizado con éxito.");
            refetch(); // Refresca la tabla
            setIsEditing(false); // Salir del modo de edición
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message); // Muestra el primer error de validación
            } else {
                console.error("Error inesperado:", error);
                alert("Hubo un problema al actualizar el registro.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isEditing ? "Editar Registro" : "Detalles del Registro"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                    {isEditing ? (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título del archivo</label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Archivo PDF</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)} // Salir del modo de edición
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm"
                                    disabled={updateCalidadAguaMutation.status === "pending"}
                                >
                                    {updateCalidadAguaMutation.status === "pending" ? "Actualizando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            {/* Mostrar detalles del archivo */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Título:</h3>
                                <p className="text-gray-600">{archivo.Titulo}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Fecha de creación:</h3>
                                <p className="text-gray-600">
                                    {new Date(archivo.Fecha_Creacion).toLocaleDateString("es-ES")}
                                </p>
                            </div>
                            {archivo.Fecha_Actualizacion && (
                                <div>
                                    <h3 className="text-lg font-medium text-gray-700">Fecha de actualización:</h3>
                                    <p className="text-gray-600">
                                        {new Date(archivo.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                    </p>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Archivo:</h3>
                                <a
                                    href={archivo.Url_Archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver archivo PDF
                                </a>
                            </div>
                            {/* Botón para activar modo de edición */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)} // Activar modo de edición
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

export default CalidadAguaModal;
//funsiona super bien 