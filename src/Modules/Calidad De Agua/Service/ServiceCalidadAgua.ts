import apiAuth from "src/Api/apiAuth";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

// Obtener todos los archivos de calidad de agua
export const getArchivosCalidadAgua = async (): Promise<ArchivoCalidadAgua[]> => {
  const res = await apiAuth.get("/calidad-agua/all");
  return res.data;
};

// Subir un nuevo archivo PDF de calidad de agua
export const uploadArchivoCalidadAgua = async (Titulo: string, Archivo_Calidad_Agua: File): Promise<ArchivoCalidadAgua> => {
  const formData = new FormData();
  formData.append("Titulo", Titulo);
  formData.append("Archivo_Calidad_Agua", Archivo_Calidad_Agua);
  const res = await apiAuth.post("/calidad-agua/create", formData);
  return res.data;
};

// Eliminar un archivo de calidad de agua (requiere endpoint DELETE en backend)
export const deleteArchivoCalidadAgua = async (id: number): Promise<void> => {
  await apiAuth.delete(`/calidad-agua/delete/${id}`);
};