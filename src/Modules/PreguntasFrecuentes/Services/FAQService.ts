import apiAuth from "@/Api/apiAuth";
import type { FAQ } from "../Models/FAQModels";

//  Obtener todas las FAQ (visibles al público)
export const getFAQ = async (): Promise<FAQ[]> => {
  const res = await apiAuth.get("/faq");
  return res.data;
};

// ✅ Obtener todas las FAQ (modo administrador)
export const getFAQAdmin = async (): Promise<FAQ[]> => {
  const res = await apiAuth.get("/faq/admin");
  return res.data;
};

// ✅ Obtener una FAQ por ID
export const getFAQById = async (id: number): Promise<FAQ> => {
  const res = await apiAuth.get(`/faq/${id}`);
  return res.data;
};

// ✅ Crear una nueva FAQ
export const createFAQ = async (data: Partial<FAQ>): Promise<FAQ> => {
  const res = await apiAuth.post("/faq", data);
  return res.data;
};

// ✅ Actualizar una FAQ existente
export const updateFAQ = async (id: number, data: Partial<FAQ>): Promise<FAQ> => {
  const res = await apiAuth.put(`/faq/${id}`, data);
  return res.data;
};

// ✅ Eliminar una FAQ
export const deleteFAQ = async (id: number): Promise<void> => {
  try {
    const res = await apiAuth.delete(`/faq/${id}`);
    if (res.status !== 200) {
      throw new Error("Error al eliminar la FAQ en el backend.");
    }
  } catch (error) {
    console.error("Error en el servicio al eliminar la FAQ:", error);
    throw new Error("Error al eliminar la FAQ.");
  }
};

// ✅ Cambiar visibilidad (true/false)
export const toggleFAQVisible = async (id: number): Promise<FAQ> => {
  const res = await apiAuth.patch(`/faq/${id}/visible`);
  return res.data;
};
