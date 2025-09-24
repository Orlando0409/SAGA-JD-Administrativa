import apiAuth from "@/Api/apiAuth";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

// Obtener todos los registros de calidad de agua
export const getArchivosCalidadAgua = async (): Promise<ArchivoCalidadAgua[]> => {
  const res = await apiAuth.get("/calidad-agua/all");
  return res.data;
};

// Subir un nuevo archivo
export const uploadArchivoCalidadAgua = async (formData: FormData): Promise<ArchivoCalidadAgua> => {
  const res = await apiAuth.post("/calidad-agua/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Asegura que se envíe como multipart/form-data
    },
  });
  return res.data;
};

// Actualizar un archivo existente
export const updateArchivoCalidadAgua = async (id: number, formData: FormData): Promise<ArchivoCalidadAgua> => {
  console.log("Datos enviados al backend:", { id, formData });
  const res = await apiAuth.put(`/calidad-agua/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("Respuesta del backend:", res.data);
  return res.data;
};

// Eliminar un archivo
export const deleteArchivoCalidadAgua = async (id: number): Promise<void> => {
    try {
        const response = await apiAuth.delete(`/calidad-agua/delete/${id}`); // Asegúrate de que esta ruta sea correcta
        if (response.status !== 200) {
            throw new Error("Error al eliminar el archivo en el backend.");
        }
    } catch (error) {
        console.error("Error en el servicio al eliminar el archivo:", error);
        throw new Error("Error al eliminar el archivo.");
    }
};