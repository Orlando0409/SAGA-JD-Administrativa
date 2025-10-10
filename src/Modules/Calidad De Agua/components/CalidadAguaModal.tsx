import { useState } from "react";
import { useUpdateCalidadAgua, useToggleVisibilidadCalidadAgua } from "../Hook/HookCalidadAgua";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";
import { FileText, Calendar, RefreshCcw, Eye, EyeOff } from "lucide-react";

interface CalidadAguaModalProps {
    isOpen: boolean; // Controla si el modal está abierto
    onClose: () => void; // Función para cerrar el modal
    archivo: {
        Id_Calidad_Agua: number;
        Titulo: string;
        Url_Archivo: string;
        Fecha_Creacion: string;
        Fecha_Actualizacion?: string;
        Visible: boolean; //  Visible en lugar de Estado
        Usuario_Creador: {
            Id_Usuario: number;
            Nombre_Usuario: string;
            Id_Rol: number;
            Nombre_Rol: string;
        };
    };
    refetch: () => void; // Función para refrescar la tabla
}

const CalidadAguaModal = ({ isOpen, onClose, archivo, refetch }: CalidadAguaModalProps) => {
    const [isEditing, setIsEditing] = useState(false); // Controla el modo de edición
    const [titulo, setTitulo] = useState(archivo.Titulo);
    const [file, setFile] = useState<File | null>(null);
    const [tituloError, setTituloError] = useState(""); // Validación de título

    const updateCalidadAguaMutation = useUpdateCalidadAgua(); // Actualizar un archivo existente
    const toggleVisibilidad = useToggleVisibilidadCalidadAgua(); // Cambiar visibilidad

    if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

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
                formData.append("Archivo_Calidad_Agua", file); // Reemplaza el archivo existente solo si se selecciona uno nuevo
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

    const handleToggleVisibility = () => {
        toggleVisibilidad.mutate(archivo.Id_Calidad_Agua, {
            onSuccess: () => {
                refetch(); // Actualizar la tabla
            }
        });
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
                <div className="p-6 space-y-6">
                    {isEditing ? (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título del archivo</label>
                                <input
                                    type="text"
                                    placeholder="Título"
                                    value={titulo}
                                    onChange={handleTituloChange}
                                    maxLength={100} // limita la cantidad de caracteres
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Archivo PDF</label>
                                <div className="relative">
                                    <input
                                        id="archivo"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 bg-white cursor-pointer">
                                        {file ? file.name : "Seleccionar Archivo"}
                                    </div>
                                </div>
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
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <div
                                    className="text-lg font-bold text-gray-800 break-words"
                                    style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                                >
                                    {archivo.Titulo}
                                </div>
                                <a
                                    href={archivo.Url_Archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline mt-2 inline-flex items-center gap-2"
                                >
                                    <FileText size={18} />
                                    Ver archivo PDF
                                </a>
                            </div>

                            {/* Estado de visibilidad */}
                            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {archivo.Visible ? (
                                            <>
                                                <Eye size={18} className="text-green-600" />
                                                <span className="text-sm font-semibold text-green-700">Visible</span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff size={18} className="text-red-600" />
                                                <span className="text-sm font-semibold text-red-700">Oculto</span>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleToggleVisibility}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${archivo.Visible
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        disabled={toggleVisibilidad.isPending}
                                    >
                                        {toggleVisibilidad.isPending
                                            ? 'Cambiando...'
                                            : archivo.Visible
                                                ? 'Ocultar'
                                                : 'Mostrar'
                                        }
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                    {archivo.Visible
                                        ? 'Este archivo es visible para los usuarios públicos'
                                        : 'Este archivo está oculto y no aparece en la vista pública'
                                    }
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                    <Calendar size={18} className="text-gray-600" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                                        <p className="text-sm font-bold text-gray-800">
                                            {new Date(archivo.Fecha_Creacion).toLocaleDateString("es-ES")}
                                        </p>
                                    </div>
                                </div>
                                {archivo.Fecha_Actualizacion && (
                                    <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                                        <RefreshCcw size={18} className="text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700">Fecha de actualización</h4>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(archivo.Fecha_Actualizacion).toLocaleDateString("es-ES")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Botones de acción */}
                            <div className="flex justify-end gap-3 mt-6">
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