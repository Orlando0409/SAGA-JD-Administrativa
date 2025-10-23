import { useState, useEffect } from "react";
import { z } from "zod";

import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { FAQ } from "../Models/FAQModels";
import { useFAQ } from "../Hook/FAQHook";
import { UpdateFAQSchema } from "../Schemas/FAQSchemas";

interface FAQFormEditProps {
    onClose: () => void;
    refetch: () => void;
    faq: FAQ;
}

export default function FAQFormEdit({ onClose, refetch, faq }: FAQFormEditProps) {
    const { editFAQ } = useFAQ(true);
    const { showSuccess, showError } = useAlerts();

    const [pregunta, setPregunta] = useState(faq.Pregunta || "");
    const [respuesta, setRespuesta] = useState(faq.Respuesta || "");
    const [preguntaError, setPreguntaError] = useState("");
    const [respuestaError, setRespuestaError] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        setPregunta(faq.Pregunta || "");
        setRespuesta(faq.Respuesta || "");
        setPreguntaError("");
        setRespuestaError("");
        setIsValid(false);
        // initialize validation for existing values
        validateAll();
    }, [faq]);

  
    const validateField = (field: "Pregunta" | "Respuesta", value: string) => {
        const trimmed = value.trim();

        // Field-level validation using pick()
        const pickSchema = UpdateFAQSchema.pick({ [field]: true } as any);
        const singleResult = pickSchema.safeParse({ [field]: trimmed });
        if (singleResult.success) {
            if (field === "Pregunta") setPreguntaError("");
            else setRespuestaError("");
        } else {
            const msg = singleResult.error.errors[0]?.message || "Error de validación";
            if (field === "Pregunta") setPreguntaError(msg);
            else setRespuestaError(msg);
        }

        // Overall form validity: validate both fields together
        const fullResult = UpdateFAQSchema.safeParse({ Pregunta: field === "Pregunta" ? trimmed : pregunta.trim(), Respuesta: field === "Respuesta" ? trimmed : respuesta.trim() });
        setIsValid(fullResult.success);
    };

    // Validate all fields at once and set errors/validity (used on mount or when faq changes)
    const validateAll = () => {
        const full = UpdateFAQSchema.safeParse({ Pregunta: pregunta.trim(), Respuesta: respuesta.trim() });
        setIsValid(full.success);

        // Reset individual errors
        setPreguntaError("");
        setRespuestaError("");

        if (!full.success) {
            for (const issue of full.error.errors) {
                const path = issue.path[0];
                const message = issue.message || "Error de validación";
                if (path === "Pregunta") setPreguntaError(message);
                if (path === "Respuesta") setRespuestaError(message);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            UpdateFAQSchema.parse({ Pregunta: pregunta.trim(), Respuesta: respuesta.trim() });

            await editFAQ(faq.Id_FAQ, { Pregunta: pregunta.trim(), Respuesta: respuesta.trim() });

            showSuccess("Pregunta actualizada correctamente.");
            refetch();
            onClose();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const msg = error.errors[0]?.message || "Error de validación.";
                setPreguntaError(msg);
                setRespuestaError(msg);
                showError(msg);
            } else {
                console.error(error);
                showError("Error al actualizar la pregunta.");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Pregunta</label>
                <textarea
                    value={pregunta}
                    onChange={(e) => { const v = e.target.value; setPregunta(v); validateField("Pregunta", v); }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    maxLength={100}
                    rows={2}
                    required
                />
                <div className="text-right text-xs text-gray-500 mt-1">{pregunta.length}/100</div>
                {preguntaError ? (
                    <p className="text-xs text-red-500 mt-1">{preguntaError}</p>
                ) : (
                    <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Respuesta</label>
                <textarea
                    value={respuesta}
                    onChange={(e) => { const v = e.target.value; setRespuesta(v); validateField("Respuesta", v); }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    maxLength={700}
                    rows={4}
                    required
                />
                <div className="text-right text-xs text-gray-500 mt-1">{respuesta.length}/700</div>
                {respuestaError ? (
                    <p className="text-xs text-red-500 mt-1">{respuestaError}</p>
                ) : (
                    <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
                )}
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg shadow-sm text-sm ${isValid ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    disabled={!isValid}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
