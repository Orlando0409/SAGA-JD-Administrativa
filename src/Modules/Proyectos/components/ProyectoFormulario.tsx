import { useState } from "react";
import { useAuth } from "@/Modules/Auth/Context/AuthContext";
import { useCreateProyecto } from "../Hook/HookProyecto";

interface FormularioProyectoProps {
    id: number; // Para identificar si es creación o edición
    tituloInicial?: string;
    descripcionInicial?: string;
    onClose: () => void; // Cierra el modal
    refetch: () => void; // Refresca la tabla
}

export default function FormularioProyecto({
    tituloInicial = "",
    descripcionInicial = "",
    onClose,
    refetch,
}: Readonly<FormularioProyectoProps>) {
    const { user } = useAuth();
    const createProyectoMutation = useCreateProyecto();

    const [titulo, setTitulo] = useState(tituloInicial);
    const [descripcion, setDescripcion] = useState(descripcionInicial);
    const [imagen, setImagen] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [tituloError, setTituloError] = useState("");
    const [descripcionError, setDescripcionError] = useState("");
    const [imagenError, setImagenError] = useState("");

    // Validar título
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

    // Validar descripción
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

    // Manejo de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setImagenError("Solo se permiten imágenes JPG, PNG o WEBP.");
            setImagen(null);
            setPreview(null);
            return;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setImagenError("La imagen no puede superar los 5MB.");
            setImagen(null);
            setPreview(null);
            return;
        }

        setImagenError("");
        setImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    // Enviar formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.Id_Usuario) {
            alert("Error: Usuario no autenticado.");
            return;
        }

        if (tituloError || descripcionError || imagenError) {
            alert("Por favor corrige los errores antes de enviar.");
            return;
        }

        const formData = new FormData();
        formData.append("titulo", titulo.trim());
        formData.append("descripcion", descripcion.trim());
        if (imagen) formData.append("imagen_proyecto", imagen);

        createProyectoMutation.mutate(
            { formData, idUsuarioCreador: user.Id_Usuario },
            {
                onSuccess: () => {
                    setTitulo("");
                    setDescripcion("");
                    setImagen(null);
                    setPreview(null);
                    onClose();
                    refetch();
                    alert("Proyecto creado con éxito.");
                },
                onError: (error) => {
                    console.error("Error al crear el proyecto:", error);
                    alert("Hubo un problema al crear el proyecto.");
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">Crear Proyecto</h3>

                {/* Campo Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        placeholder="Título del proyecto"
                        value={titulo}
                        onChange={handleTituloChange}
                        maxLength={100}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">{titulo.length}/100</div>
                    {tituloError && <p className="text-xs text-red-500 mt-1">{tituloError}</p>}
                </div>

                {/* Campo Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        placeholder="Descripción del proyecto"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        maxLength={200}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        rows={3}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/200</div>
                    {descripcionError && <p className="text-xs text-red-500 mt-1">{descripcionError}</p>}
                </div>

                {/* Campo Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen del Proyecto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-600"
                    />
                    {imagenError && <p className="text-xs text-red-500 mt-1">{imagenError}</p>}
                    {preview && (
                        <div className="mt-2">
                            <img
                                src={preview}
                                alt="Vista previa"
                                className="w-full max-h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                {/* Botones */}
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
                        disabled={createProyectoMutation.status === "pending"}
                    >
                        {createProyectoMutation.status === "pending" ? "Creando..." : "Crear Proyecto"}
                    </button>
                </div>
            </form>
        </div>
    );
}
