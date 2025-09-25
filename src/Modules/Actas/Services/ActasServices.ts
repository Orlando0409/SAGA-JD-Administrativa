import apiAuth from "@/Api/apiAuth";
import type { Acta } from "../Models/ActasModels";

// Obtener todas las actas
export const getActas = async (): Promise<Acta[]> => {
  const res = await apiAuth.get("/Actas/all");
  return res.data;
};

// Crear una nueva acta (con archivos)
export const createActa = async (formData: FormData): Promise<Acta> => {
  const res = await apiAuth.post("/Actas/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Eliminar un acta
export const deleteActa = async (id: number): Promise<void> => {
  try {
    const response = await apiAuth.delete(`/Actas/delete/${id}`);
    if (response.status !== 200) {
      throw new Error("Error al eliminar el acta en el backend.");
    }
  } catch (error) {
    console.error("Error en el servicio al eliminar el acta:", error);
    throw new Error("Error al eliminar el acta.");
  }
};