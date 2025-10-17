import { useState } from "react";
import { useGetCalidadAgua, useToggleVisibilidadCalidadAgua } from "../Hook/HookCalidadAgua";
import CalidadAguaModal from "./CalidadAguaModal";
import FormularioCalidadAgua from "./FormularioCalidadAgua";
import { FileText, Plus, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

export default function CalidadAguaTable() {
  const { data: archivos, isLoading, isError, refetch } = useGetCalidadAgua(); // Obtener los archivos
  const toggleVisibilidad = useToggleVisibilidadCalidadAgua(); // Hook para cambiar visibilidad

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

  const handleToggleVisible = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Evitar que se abra el modal
    toggleVisibilidad.mutate(id);
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
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Visibilidad</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Acciones</th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                      Cargando...
                    </td>
                  </tr>
                );
              }

              if (archivos?.length === 0) {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                      No se encontraron registros.
                    </td>
                  </tr>
                );
              }

              return archivos?.map((archivo) => (
                <tr
                  key={archivo.Id_Calidad_Agua}
                  className="hover:bg-sky-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(archivo)} // Abre el modal al hacer clic en la fila
                >
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                    <FileText size={18} className="text-sky-600" />
                    {archivo.Titulo.length > 20
                      ? `${archivo.Titulo.slice(0, 20)}...`
                      : archivo.Titulo}
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
                      onClick={(e) => handleToggleVisible(e, archivo.Id_Calidad_Agua)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${archivo.Visible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      disabled={toggleVisibilidad.isPending}
                    >
                      {archivo.Visible ? (
                        <>
                          <Eye size={14} />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} />
                          Oculto
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                    <div className="flex items-center gap-2">
                      {/* Ver detalles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Evita abrir el modal de fila
                          handleOpenModal(archivo);
                        }}
                        className="p-1 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setArchivoSeleccionado(archivo);
                          setFormVisible(true);
                        }}
                        className="p-1 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors"
                        title="Editar archivo"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Seguro que deseas eliminar "${archivo.Titulo}"?`)) {
                            console.log("Eliminar archivo:", archivo.Id_Calidad_Agua);
                            // Aquí puedes agregar la llamada a tu hook o API para eliminar
                          }
                        }}
                        className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        title="Eliminar archivo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ));
            })()}
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