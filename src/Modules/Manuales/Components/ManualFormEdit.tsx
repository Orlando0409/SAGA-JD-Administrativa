import { useState, useEffect } from "react";
import { z } from "zod";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { Manual } from "../Models/ModelsManuales";
import { UpdateManualSchema } from "../Schemas/SchemasManuales";
import { updateManual } from "../Services/ServicesManuales";

interface ManualFormEditProps {
  onClose: () => void;
  refetch: () => void;
  manual: Manual;
}

export default function ManualFormEdit({ onClose, refetch, manual }: ManualFormEditProps) {
  const { showSuccess, showError } = useAlerts();

  const [nombre, setNombre] = useState(manual.Nombre_Manual || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(manual.PDF_Manual || "");
  const [nombreError, setNombreError] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setNombre(manual.Nombre_Manual || "");
    setPreview(manual.PDF_Manual || "");
    setFile(null);
    setNombreError("");
    validateAll();
  }, [manual]);

  const validateAll = () => {
    const result = UpdateManualSchema.safeParse({
      Nombre_Manual: nombre.trim(),
      PDF_Manual: file ?? manual.PDF_Manual,
    });
    setIsValid(result.success);
    setNombreError(result.success ? "" : result.error.errors[0]?.message || "");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    const result = UpdateManualSchema.pick({ Nombre_Manual: true }).safeParse({
      Nombre_Manual: value.trim(),
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
    if (selected) setPreview(selected.name);
    validateAll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      UpdateManualSchema.parse({
        Nombre_Manual: nombre.trim(),
        PDF_Manual: file ?? manual.PDF_Manual,
      });

      const formData = new FormData();
      formData.append("Nombre_Manual", nombre.trim());
      if (file) formData.append("PDF_Manual", file);

      await updateManual(manual.Id_Manual, formData);

      showSuccess("Manual actualizado correctamente.");
      refetch();
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0]?.message || "Error de validación.";
        setNombreError(msg);
        showError(msg);
      } else {
        console.error(error);
        showError("Error al actualizar el manual.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Campo nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre del manual
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

      {/* Campo PDF */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cambiar archivo PDF
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-2/3">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-600 cursor-pointer truncate">
              {file ? file.name : "Seleccionar nuevo PDF"}
            </div>
          </div>

          {/* Vista previa PDF actual */}
          {preview && (
            <a
              href={manual.PDF_Manual}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-600 hover:underline"
            >
              Ver PDF actual
            </a>
          )}
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
