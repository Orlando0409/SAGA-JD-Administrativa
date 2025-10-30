import { useState, useEffect } from "react";
import { FileText, User } from "lucide-react";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { Manual } from "../Models/ModelsManuales";
import ManualFormEdit from "./ManualFormEdit";

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  manual: Manual;
  refetch: () => void;
}

const ManualModal = ({ isOpen, onClose, manual, refetch }: ManualModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess } = useAlerts();

  useEffect(() => {
    setIsEditing(false);
  }, [manual]);

  if (!isOpen) return null;

  const handleUpdateSuccess = () => {
    refetch();
    setIsEditing(false);
    showSuccess("Manual actualizado correctamente.");
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Editar Manual" : "Detalles del Manual"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-slate-100 scrollbar-rounded">
          {isEditing ? (
            <ManualFormEdit
              manual={manual}
              onClose={() => setIsEditing(false)}
              refetch={handleUpdateSuccess}
            />
          ) : (
            <>
              {/* Información principal */}
              <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText className="text-sky-600" />
                  {manual.Nombre_Manual}
                </div>

                {/* Vista PDF */}
                <div className="w-full flex justify-center">
                  <div className="max-w-full bg-white rounded-xl border border-gray-300 shadow-sm p-4 flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-3">
                      Archivo PDF del manual:
                    </p>
                    <a
                      href={manual.PDF_Manual}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition-colors"
                    >
                      Ver / Descargar PDF
                    </a>
                  </div>
                </div>
              </div>

              {/* Usuario responsable */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-3">
                <User size={20} className="text-sky-600" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Subido por:
                  </h4>
                  <p className="text-sm font-bold text-gray-800">
                    {manual.Usuario?.Nombre_Usuario || "Usuario desconocido"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {manual.Usuario?.Correo || "Sin correo registrado"}
                  </p>
                </div>
              </div>

              {/* Botón Editar */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm text-sm"
                >
                  Editar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
