import { useState } from "react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { z } from "zod";
import { CreateManualSchema } from "../Schemas/SchemasManuales";
import { createManual } from "../Services/ServicesManuales";

interface ManualFormProps {
  onClose: () => void;
  refetch: () => void;
}

export default function ManualForm({ onClose, refetch }: ManualFormProps) {
  const { showSuccess, showError } = useAlerts();

  const [nombre, setNombre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [nombreError, setNombreError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // ✅ Validar campo individual y formulario completo
  const validateField = (field: "Nombre_Manual", value: string) => {
    try {
      CreateManualSchema.pick({ Nombre_Manual: true }).parse({
        Nombre_Manual: value.trim(),
      });
      setNombreError("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const msg = err.errors[0]?.message || "Error de validación.";
        setNombreError(msg);
      }
    }

    try {
      CreateManualSchema.parse({
        Nombre_Manual: value.trim(),
        PDF_Manual: file || new File([], "empty.pdf"), // dummy para validar estructura
      });
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  };

  // ✅ Manejar selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  // ✅ Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showError("Debe seleccionar un archivo PDF antes de continuar.");
      return;
    }

    try {
      CreateManualSchema.parse({
        Nombre_Manual: nombre.trim(),
        PDF_Manual: file,
      });

      const formData = new FormData();
      formData.append("Nombre_Manual", nombre.trim());
      formData.append("PDF_Manual", file);

      await createManual(formData);

      showSuccess("¡Manual subido exitosamente!");
      setNombre("");
      setFile(null);
      onClose();
      refetch();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0]?.message || "Error de validación.";
        showError(msg);
      } else {
        showError("Hubo un problema al subir el manual.");
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
        <h3 className="text-lg font-semibold text-gray-800">Subir nuevo manual</h3>

        {/* Campo de Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del manual
          </label>
          <input
            type="text"
            placeholder="Ejemplo: Manual de Usuario del Sistema"
            value={nombre}
            onChange={(e) => {
              const v = e.target.value;
              setNombre(v);
              validateField("Nombre_Manual", v);
            }}
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

        {/* Campo de Archivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seleccionar archivo PDF
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
                {file ? file.name : "Seleccionar archivo PDF"}
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            <strong>Nota:</strong> El manual se actualizará automáticamente en el
            sitio informativo después de subirlo.
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
            Subir Manual
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
