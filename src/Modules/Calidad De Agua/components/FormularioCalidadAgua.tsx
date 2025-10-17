import { useState } from "react";
import { useUploadCalidadAgua } from "../Hook/HookCalidadAgua";
import { useAuth } from "@/Modules/Auth/Context/AuthContext";
import { useAlerts } from "@/Modules/Global/context/AlertContext"; // ✅ Importamos el hook de alertas

interface FormularioCalidadAguaProps {
    id: number;
    tituloInicial: string;
    onClose: () => void;
    refetch: () => void;
}

export default function FormularioCalidadAgua({ onClose, refetch }: FormularioCalidadAguaProps) {
    const { user } = useAuth();
    const uploadCalidadAguaMutation = useUploadCalidadAgua();
    const { showSuccess, showError } = useAlerts(); // ✅ Hook de alertas

    const [descripcion, setDescripcion] = useState("");
    const [titulo, setTitulo] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [tituloError, setTituloError] = useState("");
    const [descripcionError, setDescripcionError] = useState("");

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

        if (!file) {
            showError("Debe seleccionar un archivo válido."); // ✅ Reemplazado alert por showError
            return;
        }

        if (!user?.Id_Usuario) {
            showError("Error: Usuario no autenticado."); // ✅
            return;
        }

        const formData = new FormData();
        formData.append("Titulo", titulo.trim());
        formData.append("Descripcion", descripcion.trim());
        formData.append("Archivo_Calidad_Agua", file);

        uploadCalidadAguaMutation.mutate(
            {
                formData,
                idUsuarioCreador: user.Id_Usuario,
            },
            {
                onSuccess: () => {
                    setTitulo("");
                    setFile(null);
                    onClose();
                    refetch();
                    showSuccess("¡Archivo de Calidad de Agua creado exitosamente!"); // ✅
                },
                onError: (error) => {
                    console.error("Error al crear el archivo:", error);
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Hubo un problema al crear el archivo.";
                    showError(`Error al crear el archivo de Calidad de Agua: ${message}`); // ✅
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
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
                    {tituloError && <p className="text-xs text-red-500 mt-1">{tituloError}</p>}
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
                                setFile(selectedFile || null);
                            }}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        />
                        <div className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 bg-white cursor-pointer">
                            {file ? file.name : "Seleccionar Archivo"}
                        </div>
                    </div>
                </div>

                {/* Nota */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Nota:</strong> Los archivos se crean como ocultos por defecto. Puedes cambiar la visibilidad después de crear el archivo.
                    </p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm"
                        disabled={uploadCalidadAguaMutation.status === "pending"}
                    >
                        {uploadCalidadAguaMutation.status === "pending"
                            ? "Subiendo..."
                            : "Subir Archivo"}
                    </button>
                </div>
            </form>
        </div>
    );
}
