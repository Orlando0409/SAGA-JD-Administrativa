import apiAuth from "@/Api/apiAuth";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

// Obtener todos los registros de calidad de agua
export const getArchivosCalidadAgua = async (): Promise<ArchivoCalidadAgua[]> => {
  const res = await apiAuth.get("/calidad-agua/all");
  return res.data;
};

// Subir un nuevo archivo
export const uploadArchivoCalidadAgua = async (formData: FormData): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.post("/calidad-agua/create", formData);
  return res.data;
};

// Actualizar un archivo existente
export const updateArchivoCalidadAgua = async (id: number, formData: FormData): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.put(`/calidad-agua/update/${id}`, formData);
  return res.data;
};

// Eliminar un archivo
export const deleteArchivoCalidadAgua = async (id: number): Promise<void> => {
  await apiAuth.delete(`/calidad-agua/delete/${id}`);
};