import { useState } from "react";
import { useCalidadDeAgua } from "../Hook/HookCalidadAgua";
import { Eye, Trash } from "lucide-react";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";

export default function CalidadAguaTable() {
  const { archivos, loading, error, subirArchivo, eliminarArchivo } = useCalidadDeAgua();
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      // Validar el título con zod
      CalidadAguaSchema.parse({ Titulo: titulo.trim() });

      if (!file) {
        throw new Error("Debe seleccionar un archivo válido.");
      }

      const formData = new FormData();
      formData.append("Titulo", titulo.trim()); // Adjunta el título
      formData.append("Archivo_Calidad_Agua", file); // Adjunta el archivo

      console.log("FormData antes de enviar:", formData.get("Titulo"), formData.get("Archivo_Calidad_Agua")); // Depuración

      await subirArchivo(formData); // Llama al servicio con FormData
      setTitulo("");
      setFile(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message); // Mostrar el primer error de validación
      } else {
        console.error("Error al subir el archivo:", err);
        setValidationError("Error al subir el archivo.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Calidad de Agua</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Título del PDF"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              console.log("Archivo seleccionado:", selectedFile); // Depuración
              if (selectedFile) {
                setFile(selectedFile); // Guarda el archivo seleccionado en el estado
              } else {
                setFile(null); // Si no hay archivo, establece el estado como null
              }
            }}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
            required
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm whitespace-nowrap"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Subiendo..." : "Subir PDF"}
          </button>
        </div>
      </div>

      {validationError && <div className="text-red-600 mb-2">{validationError}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-50">
            <tr className="text-left text-xs sm:text-sm text-sky-700">
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Archivo</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="p-4 sm:p-6 text-center text-red-500 text-sm">
                  Error al cargar los datos
                </td>
              </tr>
            ) : archivos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              archivos.map((archivo) => (
                <tr key={archivo.Id_Calidad_Agua} className="hover:bg-sky-50 cursor-pointer transition-colors">
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">{archivo.Titulo}</td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">{archivo.fechaCreacion}</td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    <a href={archivo.Url_Archivo} target="_blank" rel="noopener noreferrer">
                      <Eye size={18} />
                    </a>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    <button
                      onClick={() => eliminarArchivo(archivo.Id_Calidad_Agua)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                      disabled={loading}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}