import apiAuth from "@/Api/apiAuth";
import type { Manual } from "../Models/ModelsManuales";

// Obtener todos los manuales
export const getManuales = async (): Promise<Manual[]> => {
    const res = await apiAuth.get("/manual");
    return res.data;
};

//  Crear un nuevo manual 
export const createManual = async (formData: FormData): Promise<Manual> => {
    const res = await apiAuth.post("/manual", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};
//  Actualizar un manual existente
export const updateManual = async (
    id: number,
    formData: FormData
): Promise<Manual> => {
    const res = await apiAuth.put(`/manual/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

//  Eliminar un manual
export const deleteManual = async (id: number): Promise<void> => {
    await apiAuth.delete(`/manual/${id}`);
};
