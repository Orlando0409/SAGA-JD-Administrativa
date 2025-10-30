import { useState } from "react";
import { ImageIcon, Plus, Pencil, Trash2 } from "lucide-react";

import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { useDeleteImagen, useGetImagenes } from "../Hook/hookEdiImagen";
import type { Imagen } from "../Models/ModelsEdiImagen";
import ImagenForm from "./EdiImagenForm";
import ImagenModal from "./EdiImagenModal";

export default function ImagenesTable() {
  const { data: imagenes, isLoading, isError, refetch } = useGetImagenes();
  const deleteImagenMutation = useDeleteImagen();
  const { showSuccess, showError } = useAlerts();

  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<Imagen | null>(null);

  const handleOpenModal = (imagen: Imagen) => {
    setImagenSeleccionada(imagen);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setImagenSeleccionada(null);
  };

  const handleDelete = (imagen: Imagen) => {
    if (confirm(`¿Seguro que deseas eliminar la imagen "${imagen.Nombre_Imagen}"?`)) {
      deleteImagenMutation.mutate(imagen.Id_Imagen, {
        onSuccess: () => {
          showSuccess("Imagen eliminada correctamente.");
          refetch();
        },
        onError: () => {
          showError("Error al eliminar la imagen.");
        },
      });
    }
  };

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-sky-800">
            Gestión de Imágenes Informativas
          </h2>
        </div>
        <button
          onClick={() => setFormVisible(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Subir Imagen
        </button>
      </div>

      {/* Errores */}
      {isError && (
        <div className="text-red-600 mb-2">Error al cargar las imágenes.</div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-50">
            <tr className="text-left text-xs sm:text-sm text-sky-700">
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">
                Nombre
              </th>

              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">
                Fecha de creación
              </th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">
                Última actualización
              </th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-slate-500 text-sm"
                    >
                      Cargando imágenes...
                    </td>
                  </tr>
                );
              }

              if (!imagenes || imagenes.length === 0) {
                return (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-slate-500 text-sm"
                    >
                      No hay imágenes registradas.
                    </td>
                  </tr>
                );
              }

              return imagenes.map((imagen) => (
                <tr
                  key={imagen.Id_Imagen}
                  className="hover:bg-sky-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(imagen)}
                >
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                    <ImageIcon size={18} className="text-sky-600" />
                    {imagen.Nombre_Imagen.length > 25
                      ? `${imagen.Nombre_Imagen.slice(0, 25)}...`
                      : imagen.Nombre_Imagen}
                  </td>



                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                    {new Date(imagen.Fecha_Creacion).toLocaleDateString("es-ES")}
                  </td>

                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                    {imagen.Fecha_Actualizacion
                      ? new Date(imagen.Fecha_Actualizacion).toLocaleDateString("es-ES")
                      : "Sin cambios"}
                  </td>

                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700">
                    <div className="flex justify-center gap-1">
                      <button
                        className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(imagen);
                        }}
                        title="Ver detalles"
                      >
                        Ver
                      </button>
                      <button
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagenSeleccionada(imagen);
                          setFormVisible(true);
                        }}
                        title="Editar imagen"
                      >
                        Editar
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(imagen);
                        }}
                        title="Eliminar imagen"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ));
            })()}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {modalOpen && imagenSeleccionada && (
        <ImagenModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          imagen={imagenSeleccionada}
          refetch={refetch}
        />
      )}

      {/* Formulario para crear o editar */}
      {formVisible && (
        <ImagenForm
          onClose={() => {
            setFormVisible(false);
            setImagenSeleccionada(null);
            refetch();
          }}

          refetch={refetch}
        />
      )}
    </div>
  );
}
