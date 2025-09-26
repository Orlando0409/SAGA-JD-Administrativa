import { useState } from "react";
import { useUploadCalidadAgua } from "../Hook/HookCalidadAgua";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";

interface FormularioCalidadAguaProps {
     id: number; // Agregada la propiedad id
    tituloInicial: string;
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}
//funciona 
export default function FormularioCalidadAgua({ onClose, refetch }: FormularioCalidadAguaProps) {
    const uploadCalidadAguaMutation = useUploadCalidadAgua(); // Subir un nuevo archivo

    const [titulo, setTitulo] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validar los datos con el esquema
            CalidadAguaSchema.parse({
                Titulo: titulo.trim(),
            });

            if (!file) {
                alert("Debe seleccionar un archivo válido.");
                return;
            }

            const formData = new FormData();
            formData.append("Titulo", titulo.trim());
            formData.append("Archivo_Calidad_Agua", file);

            await uploadCalidadAguaMutation.mutateAsync(formData);
            alert("Archivo creado con éxito.");
            setTitulo("");
            setFile(null);
            onClose(); // Oculta el modal después de crear el archivo
            refetch(); // Refresca la tabla para mostrar el nuevo archivo
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message); // Muestra el primer error de validación
            } else {
                console.error("Error inesperado:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">Crear Archivo</h3>
                <input
                    type="text"
                    placeholder="Título del archivo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
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
                    required
                />
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
                        disabled={uploadCalidadAguaMutation.status === "pending"}
                    >
                        {uploadCalidadAguaMutation.status === "pending" ? "Subiendo..." : "Subir Archivo"}
                    </button>
                </div>
            </form>
        </div>
    );
}