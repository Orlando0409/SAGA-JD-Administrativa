import apiAuth from "@/Api/apiAuth";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

export const getArchivosCalidadAgua = async (): Promise<ArchivoCalidadAgua[]> => {
  const res = await apiAuth.get("/calidad-agua/all");
  return res.data;
};

export const uploadArchivoCalidadAgua = async (formData: FormData): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.post(`/calidad-agua/create/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateArchivoCalidadAgua = async (id: number, formData: FormData): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.put(`/calidad-agua/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteArchivoCalidadAgua = async (id: number): Promise<void> => {
    try {
        const response = await apiAuth.delete(`/calidad-agua/delete/${id}`);
        if (response.status !== 200) {
            throw new Error("Error al eliminar el archivo en el backend.");
        }
    } catch (error) {
        console.error("Error en el servicio al eliminar el archivo:", error);
        throw new Error("Error al eliminar el archivo.");
    }
};

// Función para cambiar visibilidad
export const toggleVisibilidadArchivoCalidadAgua = async (id: number): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.patch(`/calidad-agua/update/visibilidad/${id}`);
  return res.data;
};