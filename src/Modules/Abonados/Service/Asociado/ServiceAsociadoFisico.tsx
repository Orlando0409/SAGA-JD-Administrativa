

import apiAuth from "@/Api/apiAuth";
import type { AsociadoFisico } from "../../Models/Asociado/ModeloAsociadoFisico";

export async function getAsociadoFisico(): Promise<AsociadoFisico[]> {
    const response = await apiAuth.get<AsociadoFisico[]>("/asociados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

export async function deleteAsociadoFisico(id: number): Promise<void> {
    await apiAuth.delete(`/asociados/fisico/${id}`);
}

export async function createAsociadoFisico(asociado: Omit<AsociadoFisico, 'Id_Asociado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<AsociadoFisico> {
    const response = await apiAuth.post<AsociadoFisico>("/asociados/fisico/create", {
        ...asociado,
        Fecha_Creacion: new Date().toISOString(),
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

export async function updateAsociadoFisico(id: number, asociado: Partial<AsociadoFisico>): Promise<AsociadoFisico> {
    const response = await apiAuth.put<AsociadoFisico>(`/asociados/fisico/${id}`, {
        ...asociado,
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

/*
export async function createAfiliacionJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitud-afiliacion-juridica/create", data);
    return response.data; 
}*/