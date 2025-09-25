import { useState } from "react";
import { useCreateActa } from "../Hook/hookActas";
import { ActaSchema } from "../Schemas/ActasSchemas";
import { z } from "zod";

interface FormularioCrearActasProps {
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}

export default function FormularioCrearActas({ onClose, refetch }: FormularioCrearActasProps) {
    const createActaMutation = useCreateActa(); // Crear una nueva acta

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validar los datos con el esquema
            ActaSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Id_Usuario: 1, // Reemplaza con el ID dinámico del usuario
            });

            if (!file) {
                alert("Debe seleccionar un archivo válido.");
                return;
            }

            const formData = new FormData();
            formData.append("Id_Usuario", "1"); // Incluye el ID del usuario (puedes reemplazar "1" con el ID dinámico)
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            formData.append("Archivo", file); // Cambiado a "Archivo" para coincidir con el backend

            createActaMutation.mutate(formData, {
                onSuccess: () => {
                    setTitulo("");
                    setDescripcion("");
                    setFile(null);
                    onClose(); // Oculta el modal después de crear el acta
                    refetch(); // Refresca la tabla para mostrar la nueva acta
                    alert("Acta creada con éxito.");
                },
                onError: (error) => {
                    console.error("Error al crear el acta:", error);
                    alert("Hubo un problema al crear el acta.");
                },
            });
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
                <h3 className="text-lg font-semibold text-gray-800">Crear Acta</h3>
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
                        disabled={createActaMutation.isPending}
                    >
                        {createActaMutation.isPending ? "Subiendo..." : "Subir Acta"}
                    </button>
                </div>
            </form>
        </div>
    );
}