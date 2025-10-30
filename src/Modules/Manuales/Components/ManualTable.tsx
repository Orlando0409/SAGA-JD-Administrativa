import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { useGetManuales, useDeleteManual } from "../Hook/hookManuales";
//import type { Manual } from "../Models/ManualesModels";
import ManualForm from "./ManualForm";
import ManualModal from "./ManualModal";
import type { Manual } from "../Models/ModelsManuales";

export default function ManualesTable() {
  const { data: manuales, isLoading, isError, refetch } = useGetManuales();
  const deleteManualMutation = useDeleteManual();
  const { showSuccess, showError } = useAlerts();

  const [modalOpen, setModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [manualSeleccionado, setManualSeleccionado] = useState<Manual | null>(null);

  const handleOpenModal = (manual: Manual) => {
    setManualSeleccionado(manual);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setManualSeleccionado(null);
  };

  const handleDelete = (manual: Manual) => {
    if (confirm(`¿Seguro que deseas eliminar el manual "${manual.Nombre_Manual}"?`)) {
      deleteManualMutation.mutate(manual.Id_Manual, {
        onSuccess: () => {
          showSuccess("Manual eliminado correctamente.");
          refetch();
        },
        onError: () => {
          showError("Error al eliminar el manual.");
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
            Gestión de Manuales
          </h2>
        </div>
        <button
          onClick={() => setFormVisible(true)}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-sm text-sm flex items-center gap-2"
        >
          <Plus size={18} />
          Subir Manual
        </button>
      </div>

      {/* Errores */}
      {isError && (
        <div className="text-red-600 mb-2">Error al cargar los manuales.</div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
        <table className="min-w-full table-auto">
          <thead className="bg-sky-50">
            <tr className="text-left text-xs sm:text-sm text-sky-700">
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Nombre</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Archivo</th>
              <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sky-50">
            {(() => {
              if (isLoading) {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">
                      Cargando manuales...
                    </td>
                  </tr>
                );
              }

              if (!manuales || manuales.length === 0) {
                return (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500 text-sm">
                      No hay manuales registrados.
                    </td>
                  </tr>
                );
              }

              return manuales.map((manual) => (
                <tr
                  key={manual.Id_Manual}
                  className="hover:bg-sky-50 transition-colors"
                >
                  {/* Nombre */}
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 flex items-center gap-2">
                    <FileText size={18} className="text-sky-600" />
                    {manual.Nombre_Manual.length > 25
                      ? `${manual.Nombre_Manual.slice(0, 25)}...`
                      : manual.Nombre_Manual}
                  </td>

                  {/* PDF */}
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-sky-600">
                    <a
                      href={manual.PDF_Manual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-sky-800"
                    >
                      Ver PDF
                    </a>
                  </td>

                  {/* Acciones */}
                  <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(manual)}
                        className="px-3 py-1 rounded-md bg-gray-700 text-white hover:bg-gray-800 text-xs"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          setManualSeleccionado(manual);
                          setFormVisible(true);
                        }}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(manual)}
                        className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 text-xs"
                      >
                        Desactivar
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
      {modalOpen && manualSeleccionado && (
        <ManualModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          manual={manualSeleccionado}
          refetch={refetch}
        />
      )}

      {/* Formulario para crear o editar */}
      {formVisible && (
        <ManualForm
          onClose={() => {
            setFormVisible(false);
            setManualSeleccionado(null);
            refetch();
          }}
          
          refetch={refetch}
        />
      )}
    </div>
  );
}
