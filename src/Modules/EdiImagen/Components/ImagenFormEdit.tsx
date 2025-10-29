import { useState, useEffect } from "react";
import { z } from "zod";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { Imagen } from "../Models/ModelsEdiImagen";
import { UpdateImagenSchema } from "../Schemas/SchemasEdiImagen";
import { updateImagen } from "../Services/ServiceEdiImagen";

interface ImagenFormEditProps {
  onClose: () => void;
  refetch: () => void;
  imagen: Imagen;
}

export default function ImagenFormEdit({ onClose, refetch, imagen }: ImagenFormEditProps) {

  const { showSuccess, showError } = useAlerts();

  const [nombre, setNombre] = useState(imagen.Nombre_Imagen || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(imagen.Imagen || "");
  const [nombreError, setNombreError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setNombre(imagen.Nombre_Imagen || "");
    setPreview(imagen.Imagen || "");
    setFile(null);
    setNombreError("");
    validateAll();
  }, [imagen]);

  const validateAll = () => {
    const result = UpdateImagenSchema.safeParse({
      Nombre_Imagen: nombre.trim(),
      Imagen: file ?? imagen.Imagen,
    });
    setIsValid(result.success);
    setNombreError(result.success ? "" : result.error.errors[0]?.message || "");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    const result = UpdateImagenSchema.pick({ Nombre_Imagen: true }).safeParse({
      Nombre_Imagen: value.trim(),
    });
    if (result.success) {
      setNombreError("");
      validateAll();
    } else {
      setNombreError(result.error.errors[0]?.message || "Error de validación.");
      setIsValid(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
    validateAll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      UpdateImagenSchema.parse({
        Nombre_Imagen: nombre.trim(),
        Imagen: file ?? imagen.Imagen,
      });

      const formData = new FormData();
      formData.append("Nombre_Imagen", nombre.trim());
      if (file) formData.append("Imagen", file);

      await updateImagen(imagen.Id_Imagen, formData);

      showSuccess("Imagen actualizada correctamente.");
      refetch();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0]?.message || "Error de validación.";
        setNombreError(msg);
        showError(msg);
      } else {
        console.error(error);
        showError("Error al actualizar la imagen.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Campo nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre de la imagen
        </label>
        <input
          type="text"
          value={nombre}
          onChange={handleNombreChange}
          maxLength={100}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          required
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {nombre.length}/100
        </div>
        {nombreError ? (
          <p className="text-xs text-red-500 mt-1">{nombreError}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
        )}
      </div>

      {/* Campo imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cambiar imagen
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
              {file ? file.name : "Seleccionar nueva imagen"}
            </div>
          </div>

         
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`px-4 py-2 rounded-lg shadow-sm text-sm ${
            isValid
              ? "bg-sky-600 text-white hover:bg-sky-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Guardar
        </button>
      </div>
    </form>
  );
}


