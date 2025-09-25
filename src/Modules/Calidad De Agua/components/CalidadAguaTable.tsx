import { useState, useEffect } from "react";
import { useCalidadDeAgua } from "../Hook/HookCalidadAgua";
import CalidadAguaModal from "./CalidadAguaModal";
import { Trash, FileText } from "lucide-react";
import { CalidadAguaSchema } from "../schemas/CalidadDeAgua";
import { z } from "zod";
import { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

export default function CalidadAguaTable() {
  const { archivos, fetchArchivos, reemplazarArchivo, subirArchivo, eliminarArchivo, loading, error } = useCalidadDeAgua();
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoCalidadAgua | null>(null);

  // Cargar los archivos al montar el componente
  useEffect(() => {
    fetchArchivos();
  }, [fetchArchivos]);

  const handleOpenModal = (archivo: ArchivoCalidadAgua) => {
    setArchivoSeleccionado(archivo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setArchivoSeleccionado(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    try {
      CalidadAguaSchema.parse({ Titulo: titulo.trim() });

      if (!file) {
        throw new Error("Debe seleccionar un archivo válido.");
      }

      const formData = new FormData();
      formData.append("Titulo", titulo.trim());
      formData.append("Archivo_Calidad_Agua", file);

      const nuevoArchivo: ArchivoCalidadAgua = await subirArchivo(formData);
      setTitulo("");
      setFile(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      } else {
        console.error("Error al subir el archivo:", err);
        setValidationError("Error al subir el archivo.");
      }
    }
  };

  const handleReemplazarArchivo = async (id: number, formData: FormData) => {
    try {
      console.log(`Reemplazando archivo con ID: ${id}`);
      await reemplazarArchivo(id, formData); // El estado `archivos` se actualiza automáticamente dentro del hook
      alert("Archivo reemplazado correctamente.");
    } catch (error) {
      console.error("Error al reemplazar el archivo:", error);
      alert("Hubo un problema al reemplazar el archivo. Intente nuevamente.");
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
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 text-sm text-sky-700 cursor-pointer">
              {file ? file.name : "Seleccione un archivo"}
            </div>
          </div>
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
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de actualización</th>
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
                  Error al cargar los datos.
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
                <tr
                  key={archivo.Id_Calidad_Agua}
                  className="hover:bg-sky-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(archivo)}
                >
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                    <FileText size={18} className="text-sky-600" />
                    {archivo.Titulo}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    {new Date(archivo.Fecha_Creacion).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    {archivo.Fecha_Actualizacion
                      ? new Date(archivo.Fecha_Actualizacion).toLocaleDateString("es-ES")
                      : "No hay actualizaciones"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarArchivo(archivo.Id_Calidad_Agua);
                      }}
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

      {modalOpen && archivoSeleccionado && (
        <CalidadAguaModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          archivo={archivoSeleccionado}
          onEliminar={eliminarArchivo}
          onReemplazar={handleReemplazarArchivo}
        />
      )}
    </div>
  );
}