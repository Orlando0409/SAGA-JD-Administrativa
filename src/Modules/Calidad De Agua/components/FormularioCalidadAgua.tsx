import { useState } from "react";
import { useUploadCalidadAgua } from "../Hook/HookCalidadAgua";

interface FormularioCalidadAguaProps {
    id: number; // Agregada la propiedad id
    tituloInicial: string;
    onClose: () => void; // Función para cerrar el modal
    refetch: () => void; // Función para refrescar la tabla
}

export default function FormularioCalidadAgua({ onClose, refetch }: FormularioCalidadAguaProps) {
    const uploadCalidadAguaMutation = useUploadCalidadAgua(); // Subir un nuevo archivo

    const [titulo, setTitulo] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [tituloError, setTituloError] = useState(""); // Validación de título

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

        if (!file) {
            alert("Debe seleccionar un archivo válido.");
            return;
        }

        const formData = new FormData();
        formData.append("Titulo", titulo.trim());
        formData.append("Archivo_Calidad_Agua", file);

        uploadCalidadAguaMutation.mutate(formData, {
            onSuccess: () => {
                setTitulo("");
                setFile(null);
                onClose(); // Oculta el modal después de crear el archivo
                refetch(); // Refresca la tabla para mostrar el nuevo archivo
                alert("Archivo creado con éxito.");
            },
            onError: (error) => {
                console.error("Error al crear el archivo:", error);
                alert("Hubo un problema al crear el archivo.");
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">Crear Archivo</h3>

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
                        disabled={uploadCalidadAguaMutation.status === "pending"}
                    >
                        {uploadCalidadAguaMutation.status === "pending" ? "Subiendo..." : "Subir Archivo"}
                    </button>
                </div>
            </form>
        </div>
    );
} //funciona 