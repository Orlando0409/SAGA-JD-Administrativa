import { useState } from "react";
import { useGetActas, useCreateActa, useDeleteActa } from "../Hook/hookActas";
import { Trash, FileText } from "lucide-react";
import type { Acta } from "../Models/ActasModels";
import ActasModal from "./ActasModal";
import { ActaSchema } from "../Schemas/ActasSchemas";
import { z } from "zod";

export default function ActasTable() {
    const { data: actas, isLoading, isError } = useGetActas(); // Obtener todas las actas
    const createActaMutation = useCreateActa(); // Crear una nueva acta
    const deleteActaMutation = useDeleteActa(); // Eliminar una acta

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [actaSeleccionada, setActaSeleccionada] = useState<Acta | null>(null);

    const handleOpenModal = (acta: Acta) => {
        setActaSeleccionada(acta);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setActaSeleccionada(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Validar los datos con el esquema
            ActaSchema.parse({
                Titulo: titulo.trim(),
                Descripcion: descripcion.trim(),
                Id_Usuario: 1, // Reemplaza con el ID dinámico del usuario
            });

            if (!file) {
                alert("Debe seleccionar un archivo válido.");
                return;
            }

            const formData = new FormData();
            formData.append("Id_Usuario", "1"); // Incluye el ID del usuario (puedes reemplazar "1" con el ID dinámico)
            formData.append("Titulo", titulo.trim());
            formData.append("Descripcion", descripcion.trim());
            formData.append("Archivo", file); // Cambiado a "Archivo" para coincidir con el backend

            createActaMutation.mutate(formData, {
                onSuccess: () => {
                    setTitulo("");
                    setDescripcion("");
                    setFile(null);
                    alert("Acta creada con éxito.");
                },
                onError: (error) => {
                    console.error("Error al crear el acta:", error);
                    alert("Hubo un problema al crear el acta.");
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(error.errors[0].message); // Muestra el primer error de validación
            } else {
                console.error("Error inesperado:", error);
            }
        }
    };

    const handleEliminarActa = async (id: number) => {
        deleteActaMutation.mutate(id, {
            onSuccess: () => {
                alert("Acta eliminada con éxito.");
            },
            onError: () => {
                alert("Hubo un problema al eliminar el acta.");
            },
        });
    };

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold text-sky-800">Gestión de Actas</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input
                        type="text"
                        placeholder="Título del Acta"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-200 text-sm"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Descripción del Acta"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
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
                        disabled={createActaMutation.isPending}
                    >
                        {createActaMutation.isPending ? "Subiendo..." : "Subir Acta"}
                    </button>
                </div>
            </div>

            {isError && <div className="text-red-600 mb-2">Error al cargar las actas.</div>}

            <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
                <table className="min-w-full table-auto">
                    <thead className="bg-sky-50">
                        <tr className="text-left text-xs sm:text-sm text-sky-700">
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Título</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Descripción</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Fecha de creación</th>
                            <th className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sky-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    Cargando...
                                </td>
                            </tr>
                        ) : actas?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                                    No se encontraron registros.
                                </td>
                            </tr>
                        ) : (
                            actas?.map((acta) => (
                                <tr
                                    key={acta.Id_Acta}
                                    className="hover:bg-sky-50 cursor-pointer transition-colors"
                                    onClick={() => handleOpenModal(acta)} // Abre el modal al hacer clic en la fila
                                >
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top flex items-center gap-2">
                                        <FileText size={18} className="text-sky-600" />
                                        {acta.Titulo}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        {acta.Descripcion}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        {new Date(acta.Fecha_Creacion).toLocaleDateString("es-ES")}
                                    </td>
                                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEliminarActa(acta.Id_Acta);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                            title="Eliminar"
                                            disabled={deleteActaMutation.isPending}
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

            {modalOpen && actaSeleccionada && (
                <ActasModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    acta={actaSeleccionada}
                    onEliminar={handleEliminarActa}
                />
            )}
        </div>
    );
}