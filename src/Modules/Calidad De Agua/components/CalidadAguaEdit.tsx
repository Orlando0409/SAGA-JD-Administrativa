import { useState, useEffect } from "react";
import { useUpdateCalidadAgua } from "../Hook/HookCalidadAgua";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";
import { FileText, X } from "lucide-react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

interface CalidadAguaEditProps {
    archivo: ArchivoCalidadAgua;
    onClose: () => void;
    refetch: () => void;
}

export default function CalidadAguaEdit({ archivo, onClose, refetch }: CalidadAguaEditProps) {
    const updateCalidadAguaMutation = useUpdateCalidadAgua();
    const { showSuccess, showError } = useAlerts();

    const [titulo, setTitulo] = useState(archivo.Titulo || "");
    const [descripcion, setDescripcion] = useState(archivo.Descripcion || "");
    const [file, setFile] = useState<File | null>(null);
    const [tituloError, setTituloError] = useState("");
    const [descripcionError, setDescripcionError] = useState("");

    useEffect(() => {
        setTitulo(archivo.Titulo || "");
        setDescripcion(archivo.Descripcion || "");
        setTituloError("");
        setDescripcionError("");
        setFile(null);
    }, [archivo]);

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
        const value = e.target.value || "";
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

        try {
            CalidadAguaSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
            });

            const formData = new FormData();
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            if (file) {
                formData.append("Archivo_Calidad_Agua", file);
            }

            await updateCalidadAguaMutation.mutateAsync({ id: archivo.Id_Calidad_Agua, formData });

            showSuccess("Registro actualizado con éxito.");
            refetch();
            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                showError(error.errors[0].message);
            } else {
                console.error("Error inesperado:", error);
                showError("Hubo un problema al actualizar el registro.");
            }
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Editar Registro</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título del archivo</label>
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
                        {tituloError && <p className="text-xs text-red-500 mt-1">{tituloError}</p>}
                    </div>

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
                            {(descripcion || "").length}/200
                        </div>
                        {descripcionError && <p className="text-xs text-red-500 mt-1">{descripcionError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Archivo PDF</label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                            <FileText size={16} className="text-blue-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">
                                    Archivo actual
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
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                        {file && (
                            <div className="mt-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                                Nuevo archivo seleccionado: {file.name}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                         <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm text-sm"
                            disabled={updateCalidadAguaMutation.status === "pending"}
                        >
                            {updateCalidadAguaMutation.status === "pending"
                                ? "Actualizando..."
                                : "Guardar"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}