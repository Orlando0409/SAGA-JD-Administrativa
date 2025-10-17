import { useState } from "react";
import { useAuth } from "@/Modules/Auth/Context/AuthContext";
import { useCreateProyecto } from "../Hook/HookProyecto";
//import { ProyectoSchema } from "../Schemas/ProyectoSchemas";
import { z } from "zod";
import { ProyectoSchema } from "../schemas/Proyecto";

interface FormularioProyectoProps {
    id: number;
    tituloInicial?: string;
    descripcionInicial?: string;
    onClose: () => void;
    refetch: () => void;
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

    const [errors, setErrors] = useState<{
        Titulo?: string;
        Descripcion?: string;
        Imagen_Url?: string;
    }>({});

    // Validar título usando Zod
    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitulo(value);

        try {
            ProyectoSchema.shape.Titulo.parse(value);
            setErrors(prev => ({ ...prev, Titulo: undefined }));
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, Titulo: error.errors[0].message }));
            }
        }
    };

    // Validar descripción usando Zod
    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);

        try {
            ProyectoSchema.shape.Descripcion.parse(value);
            setErrors(prev => ({ ...prev, Descripcion: undefined }));
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, Descripcion: error.errors[0].message }));
            }
        }
    };

    // Validar archivo usando Zod
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, Imagen_Url: "El archivo no puede superar los 5MB." }));
            setImagen(null);
            setPreview(null);
            return;
        }

        try {
            ProyectoSchema.shape.Imagen_Url.parse(file);
            setErrors(prev => ({ ...prev, Imagen_Url: undefined }));
            setImagen(file);

            // Solo mostrar preview si es imagen (no PDF)
            if (file.type.startsWith("image/")) {
                setPreview(URL.createObjectURL(file));
            } else {
                setPreview(null);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(prev => ({ ...prev, Imagen_Url: error.errors[0].message }));
                setImagen(null);
                setPreview(null);
            }
        }
    };

    // Enviar formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.Id_Usuario) {
            alert("Error: Usuario no autenticado.");
            return;
        }

        // Validar que existe la imagen
        if (!imagen) {
            setErrors(prev => ({ ...prev, Imagen_Url: "Debes subir un archivo para el proyecto." }));
            return;
        }

        // Validar con el schema completo antes de enviar
        try {
            ProyectoSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Imagen_Url: imagen,
                Id_Usuario: user.Id_Usuario
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: typeof errors = {};
                error.errors.forEach(err => {
                    const field = err.path[0] as keyof typeof errors;
                    newErrors[field] = err.message;
                });
                setErrors(newErrors);
                return;
            }
        }

        const formData = new FormData();
        formData.append("Titulo", titulo.trim());
        formData.append("Descripcion", descripcion.trim());
        formData.append("Id_Usuario", user.Id_Usuario.toString());
        formData.append("Imagen_Proyecto", imagen);

        createProyectoMutation.mutate(
            { formData, idUsuarioCreador: user.Id_Usuario },
            {
                onSuccess: () => {
                    setTitulo("");
                    setDescripcion("");
                    setImagen(null);
                    setPreview(null);
                    setErrors({});
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
        
        <div className="fixed inset-0  backdrop-blur-none flex items-center justify-center z-50">
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
                    {errors.Titulo && <p className="text-xs text-red-500 mt-1">{errors.Titulo}</p>}
                </div>

                {/* Campo Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        placeholder="Descripción del proyecto"
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        maxLength={1000}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        rows={3}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">{descripcion.length}/1000</div>
                    {errors.Descripcion && <p className="text-xs text-red-500 mt-1">{errors.Descripcion}</p>}
                </div>

                {/* Campo Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Archivo del Proyecto</label>
                    <label className="block w-full cursor-pointer border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
                        <span className="text-xs text-gray-500">
                            {imagen ? imagen.name : "Selecciona un archivo"}
                        </span>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.heic,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                        />
                    </label>
                    {errors.Imagen_Url && <p className="text-xs text-red-500 mt-1">{errors.Imagen_Url}</p>}
                    {imagen && (
                        <input
                            type="text"
                            value={imagen.name}
                            readOnly
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 mt-2"
                        />
                    )}

                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Nota:</strong> Los archivos se crean como ocultos por defecto. Puedes cambiar la visibilidad después de crear el archivo.
                    </p>
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