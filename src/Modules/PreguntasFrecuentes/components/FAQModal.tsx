import { useState, useEffect } from "react";
import { Eye, EyeOff, Calendar, RefreshCcw, MessageSquare } from "lucide-react";

import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { FAQ } from "../Models/FAQModels";
import { useFAQ } from "../Hook/FAQHook";
import FAQFormEdit from "./FAQFormEdit";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ;
  refetch: () => void;
}

const FAQModal = ({ isOpen, onClose, faq, refetch }: FAQModalProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const { toggleVisible } = useFAQ(true);
  const { showSuccess, showError } = useAlerts();

  useEffect(() => {
    // close edit form when the faq changes
    setIsEditing(false);
  }, [faq]);

  if (!isOpen) return null;

  //  Cambiar visibilidad
  const handleToggleVisibility = async () => {
    try {
      await toggleVisible(faq.Id_FAQ);
      refetch();
      showSuccess(
        faq.Visible
          ? "La pregunta ahora está oculta."
          : "La pregunta ahora es visible."
      );
    } catch {
      showError("Error al cambiar la visibilidad.");
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Editar Pregunta" : "Detalles de la Pregunta"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {isEditing ? (
            <FAQFormEdit onClose={() => setIsEditing(false)} refetch={refetch} faq={faq} />
          ) : (
            <>
              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="text-lg font-bold text-gray-800 break-words">
                  <MessageSquare className="inline text-sky-600 mr-2" />
                  {faq.Pregunta}
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Respuesta</h4>
                <p className="text-sm text-gray-800 break-words">{faq.Respuesta || "Sin respuesta registrada."}</p>
              </div>

              {/* Visibilidad */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {faq.Visible ? (
                      <>
                        <Eye size={18} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={18} className="text-red-600" />
                        <span className="text-sm font-semibold text-red-700">Oculta</span>
                      </>
                    )}
                  </div>
                  <button onClick={handleToggleVisibility} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${faq.Visible ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                    {faq.Visible ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {faq.Visible ? "Esta pregunta es visible para los usuarios públicos." : "Esta pregunta está oculta y no aparece en la vista pública."}
                </p>
              </div>

              {/* Fechas */}
              <div className="flex gap-4 mt-4">
                <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                  <Calendar size={18} className="text-gray-600" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Fecha de creación</h4>
                    <p className="text-sm font-bold text-gray-800">{new Date(faq.Fecha_Creacion).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
                {faq.Fecha_Actualizacion && (
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg p-4 shadow-sm flex items-center gap-2">
                    <RefreshCcw size={18} className="text-gray-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">Fecha de actualización</h4>
                      <p className="text-sm font-bold text-gray-800">{new Date(faq.Fecha_Actualizacion).toLocaleDateString("es-ES")}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-sm text-sm">Editar</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default FAQModal;
