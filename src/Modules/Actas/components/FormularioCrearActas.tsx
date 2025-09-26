import { useState } from "react";
import { useCreateActa } from "../Hook/hookActas";

interface FormularioCrearActasProps {
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}

export default function FormularioCrearActas({ onClose, refetch }: FormularioCrearActasProps) {
    const createActaMutation = useCreateActa(); // Crear una nueva acta

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [tituloError, setTituloError] = useState(""); // Validación de título
    const [descripcionError, setDescripcionError] = useState(""); // Validación de descripción

    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitulo(value);
        if (value.length === 20) {
            setTituloError("Ya llegó al máximo de caracteres permitidos.");
        } else {
            setTituloError("");
        }
    };

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);
        if (value.length === 50) {
            setDescripcionError("Ya llegó al máximo de caracteres permitidos.");
        } else {
            setDescripcionError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
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
                        maxLength={20}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {titulo.length}/20
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
                        maxLength={50}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        rows={3}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {descripcion.length}/50
                    </div>
                    {descripcionError && (
                        <p className="text-xs text-red-500 mt-1">{descripcionError}</p>
                    )}
                </div>

                {/* Campo de Archivo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Archivo</label>
                    <div className="relative">
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