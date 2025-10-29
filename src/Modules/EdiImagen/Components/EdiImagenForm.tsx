import { useState } from "react";

import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { z } from "zod";
import { CreateImagenSchema } from "../Schemas/SchemasEdiImagen";
import { createImagen } from "../Services/ServiceEdiImagen";

interface ImagenFormProps {
  onClose: () => void;
  refetch: () => void;
}

export default function ImagenForm({ onClose, refetch }: ImagenFormProps) {

  const { showSuccess, showError } = useAlerts();

  const [nombre, setNombre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [nombreError, setNombreError] = useState("");
  const [isValid, setIsValid] = useState(false);

  //  Validar campo individual y formulario completo
  const validateField = (field: "Nombre_Imagen", value: string) => {
    try {
      CreateImagenSchema.pick({ Nombre_Imagen: true }).parse({
        Nombre_Imagen: value.trim(),
      });
      setNombreError("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.errors[0]?.message || "Error de validación.";
        setNombreError(msg);
      }
    }

    try {
      CreateImagenSchema.parse({
        Nombre_Imagen: value.trim(),
      });
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  //  Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showError("Debe seleccionar una imagen antes de continuar.");
      return;
    }

    try {
      CreateImagenSchema.parse({
        Nombre_Imagen: nombre.trim(),
      });

      const formData = new FormData();
      formData.append("Nombre_Imagen", nombre.trim());
      formData.append("Imagen", file);

      await createImagen(formData);

      showSuccess("¡Imagen subida exitosamente!");
      setNombre("");
      setFile(null);
      setPreview(null);
      onClose();
      refetch();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0]?.message || "Error de validación.";
        showError(msg);
      } else {
        showError("Hubo un problema al subir la imagen.");
        console.error(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-800">
          Subir nueva imagen
        </h3>

        {/* Campo de Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la imagen
          </label>
          <input
            type="text"
            placeholder="Ejemplo: Tanque principal"
            value={nombre}
            onChange={(e) => {
              const v = e.target.value;
              setNombre(v);
              validateField("Nombre_Imagen", v);
            }}
            maxLength={50}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {nombre.length}/50
          </div>
          {nombreError ? (
            <p className="text-xs text-red-500 mt-1">{nombreError}</p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
          )}
        </div>

        {/* Campo de Imagen */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seleccionar imagen
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:w-2/3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-600 cursor-pointer">
                {file ? file.name : "Seleccionar archivo de imagen"}
              </div>
            </div>

          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>Nota:</strong> La imagen se actualizará automáticamente en
            el sitio informativo después de subirla.
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg shadow-sm text-sm ${
              isValid && file
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!isValid || !file}
          >
            Subir Imagen
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
  );
}


