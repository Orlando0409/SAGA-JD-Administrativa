import { useState } from "react";
import { useGetCalidadAgua } from "../Hook/HookCalidadAgua";
import CalidadAguaModal from "./CalidadAguaModal";
import FormularioCalidadAgua from "./FormularioCalidadAgua";
import { FileText, Plus } from "lucide-react";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

export default function CalidadAguaTable() {
  const { data: archivos, isLoading, isError, refetch } = useGetCalidadAgua(); // Obtener los archivos

  const [modalOpen, setModalOpen] = useState(false); // Controla la visibilidad del modal para editar
  const [formVisible, setFormVisible] = useState(false); // Controla la visibilidad del formulario para crear
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoCalidadAgua | null>(null); // Archivo seleccionado para el modal

  const handleOpenModal = (archivo: ArchivoCalidadAgua) => {
    setArchivoSeleccionado(archivo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setArchivoSeleccionado(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Calidad de Agua</h2>
        </div>
        <button
          onClick={() => setFormVisible(true)} // Muestra el formulario para crear un archivo
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Crear Archivo
        </button>
      </div>

      {/* Mostrar errores */}
      {isError && <div className="text-red-600 mb-2">Error al cargar los archivos.</div>}

      {/* Tabla de archivos */}
      <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-50">
            <tr className="text-left text-xs sm:text-sm text-sky-700">
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de actualización</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  Cargando...
                </td>
              </tr>
            ) : archivos?.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              archivos?.map((archivo) => (
                <tr
                  key={archivo.Id_Calidad_Agua}
                  className="hover:bg-sky-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(archivo)} // Abre el modal al hacer clic en la fila
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para editar */}
      {modalOpen && archivoSeleccionado && (
        <CalidadAguaModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          archivo={archivoSeleccionado}
          refetch={refetch}
        />
      )}

      {/* Formulario para crear */}
      {formVisible && (
        <FormularioCalidadAgua
          id={0} // ID inicial para un nuevo archivo
          tituloInicial="" // Título vacío para un nuevo archivo
          onClose={() => setFormVisible(false)} // Cierra el formulario
          refetch={refetch} // Refresca la tabla
        />
      )}
    </div>
  );
}