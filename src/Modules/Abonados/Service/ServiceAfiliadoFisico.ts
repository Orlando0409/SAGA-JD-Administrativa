import apiAuth from "@/Api/apiAuth";
import type { AfiliadoFisico } from "../Models/TablaAfiliados/ModeloAfiliadoFisico";

export async function getAfiliadosFisicos(): Promise<AfiliadoFisico[]> {
    const response = await apiAuth.get<AfiliadoFisico[]>("/afiliados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

// En tu Hook o Service
export const createAfiliadoFisico = async (formData: FormData) => {
    const response = await apiAuth.post("/afiliados/fisico/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // ✅ Importante
        },
    });

    return response.data;
};

export const updateAfiliadoFisico = async (cedula: string, formData: FormData) => {
    const response = await apiAuth.put(`/afiliados/update/fisico/${cedula}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updateEstadoAfiliadoFisico = async (id: string, nuevoEstadoId: number) => {
    const response = await apiAuth.patch(`/afiliados/fisico/${id}/update/estado/${nuevoEstadoId}`);
    return response.data;
};