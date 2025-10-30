import { useState, useEffect } from "react";
import { useFAQ } from "../Hook/FAQHook";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { z } from "zod";
import { CreateFAQSchema, UpdateFAQSchema } from "../Schemas/FAQSchemas";
import type { FAQ } from "../Models/FAQModels";

interface FAQFormProps {
    onClose: () => void;
    refetch: () => void;
    initialData?: FAQ; // Nueva prop opcional para modo editar
}

export default function FAQForm({ onClose, refetch, initialData }: Readonly<FAQFormProps>) {
    const { addFAQ, editFAQ } = useFAQ(true);
    const { showSuccess, showError } = useAlerts();

    const isEdit = !!initialData; // Determina si es modo editar

    const [pregunta, setPregunta] = useState(initialData?.Pregunta || "");
    const [respuesta, setRespuesta] = useState(initialData?.Respuesta || "");
    const [preguntaError, setPreguntaError] = useState("");
    const [respuestaError, setRespuestaError] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Reset form when initialData changes
    useEffect(() => {
        setPregunta(initialData?.Pregunta || "");
        setRespuesta(initialData?.Respuesta || "");
        setPreguntaError("");
        setRespuestaError("");
        setIsValid(false);
        if (initialData) {
            validateAll();
        }
    }, [initialData]);

    // Validar campo individual
    const validateField = (field: "Pregunta" | "Respuesta", value: string) => {
        const schema = isEdit ? UpdateFAQSchema : CreateFAQSchema;
        try {
            if (field === "Pregunta") {
                schema.pick({ Pregunta: true }).parse({ Pregunta: value.trim() });
                setPreguntaError("");
            } else {
                schema.pick({ Respuesta: true }).parse({ Respuesta: value.trim() });
                setRespuestaError("");
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const message = err.errors[0]?.message || "Error de validación";
                if (field === "Pregunta") setPreguntaError(message);
                else setRespuestaError(message);
            }
        }

        // Validar formulario completo
        try {
            schema.parse({ 
                Pregunta: field === "Pregunta" ? value.trim() : pregunta.trim(), 
                Respuesta: field === "Respuesta" ? value.trim() : respuesta.trim() 
            });
            setIsValid(true);
        } catch {
            setIsValid(false);
        }
    };

    // Validar el formulario
    const validateAll = () => {
        const schema = isEdit ? UpdateFAQSchema : CreateFAQSchema;
        try {
            schema.parse({ Pregunta: pregunta.trim(), Respuesta: respuesta.trim() });
            setIsValid(true);
            setPreguntaError("");
            setRespuestaError("");
        } catch (err) {
            setIsValid(false);
            if (err instanceof z.ZodError) {
                for (const error of err.errors) {
                    if (error.path[0] === "Pregunta") setPreguntaError(error.message);
                    if (error.path[0] === "Respuesta") setRespuestaError(error.message);
                }
            }
        }
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const schema = isEdit ? UpdateFAQSchema : CreateFAQSchema;
            schema.parse({
                Pregunta: pregunta.trim(),
                Respuesta: respuesta.trim(),
            });

            if (isEdit && initialData) {
                await editFAQ(initialData.Id_FAQ, {
                    Pregunta: pregunta.trim(),
                    Respuesta: respuesta.trim(),
                });
                showSuccess("¡Pregunta actualizada exitosamente!");
            } else {
                await addFAQ({
                    Pregunta: pregunta.trim(),
                    Respuesta: respuesta.trim(),
                });
                showSuccess("¡Pregunta creada exitosamente!");
            }

            setPregunta("");
            setRespuesta("");
            onClose();
            refetch();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const msg = error.errors[0]?.message || "Error de validación.";
                showError(msg);
            } else {
                showError(`Hubo un problema al ${isEdit ? 'actualizar' : 'crear'} la pregunta frecuente.`);
                console.error(error);
            }
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">
                    {isEdit ? "Editar Pregunta Frecuente" : "Crear Pregunta Frecuente"}
                </h3>

                {/* Campo de Pregunta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Pregunta
                    </label>
                    <textarea
                        placeholder="Escribe la pregunta..."
                        value={pregunta}
                        onChange={(e) => {
                            const v = e.target.value;
                            setPregunta(v);
                            validateField("Pregunta", v);
                        }}
                        maxLength={100}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                        rows={2}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {pregunta.length}/100
                    </div>
                    {preguntaError ? (
                        <p className="text-xs text-red-500 mt-1">{preguntaError}</p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
                    )}
                </div>

                {/* Campo de Respuesta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Respuesta
                    </label>
                    <textarea
                        placeholder="Escribe la respuesta a la pregunta..."
                        value={respuesta}
                        onChange={(e) => {
                            const v = e.target.value;
                            setRespuesta(v);
                            validateField("Respuesta", v);
                        }}
                        maxLength={700}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm break-words"
                        style={{ whiteSpace: "normal", overflowWrap: "break-word" }}
                        rows={5}
                        required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {respuesta.length}/700
                    </div>
                    {respuestaError ? (
                        <p className="text-xs text-red-500 mt-1">{respuestaError}</p>
                    ) : (
                        <p className="text-xs text-gray-400 mt-1">&nbsp;</p>
                    )}
                </div>

                {/* Nota informativa */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700">
                        <strong>Nota:</strong> Las preguntas {isEdit ? 'actualizadas' : 'creadas'} se mostrarán como
                        visibles automáticamente en la sección pública.
                    </p>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg shadow-sm text-sm ${isValid ? 'bg-sky-600 text-white hover:bg-sky-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                        disabled={!isValid}
                    >
                        {isEdit ? "Guardar Cambios" : "Crear Pregunta"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}