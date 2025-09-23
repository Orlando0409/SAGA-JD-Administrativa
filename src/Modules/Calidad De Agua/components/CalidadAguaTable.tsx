import { useState } from "react";
import { Eye, Trash } from "lucide-react";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";
import { useCalidadDeAgua } from "../Hook/HookCalidadAgua";
export default function CalidadAguaTable() {
 const {archivos,loading,error,subirArchivo,eliminarArchivo} = useCalidadDeAgua();
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titulo) return;
    await subirArchivo(titulo, file);
    setTitulo("");
    setFile(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Calidad de Agua</h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Título del PDF"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="border rounded px-2 py-1 flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded font-medium"
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Subir PDF"}
        </button>
      </form>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full border rounded">
          <thead className="bg-sky-50">
            <tr>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Archivo</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((archivo:ArchivoCalidadAgua) => (
              <tr key={archivo.id} className="hover:bg-sky-50">
                <td className="px-4 py-2">{archivo.Titulo}</td>
                <td className="px-4 py-2">{archivo.fechaCreacion}</td>
                <td className="px-4 py-2">
                  <a href={archivo.Archivo_Calidad_Agua} target="_blank" rel="noopener noreferrer">
                    <Eye size={18} />
                  </a>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => eliminarArchivo(archivo.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                    disabled={loading}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {archivos.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay archivos subidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

