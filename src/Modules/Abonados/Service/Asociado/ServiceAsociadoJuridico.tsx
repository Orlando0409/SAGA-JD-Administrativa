import apiAuth from "@/Api/apiAuth";
import type { AsociadoJuridico } from "../../Models/Asociado/ModeloAsociadoJuridico";

export async function getAsociadoJuridicos(): Promise<AsociadoJuridico[]> {
    const response = await apiAuth.get<AsociadoJuridico[]>("/asociados/juridico/all");
    console.log('Response del API Jurídicos:', response.data); // 🔍 Debug
    return response.data;
}

export async function deleteAsociadoJuridico(id: number): Promise<void> {
    await apiAuth.delete(`/asociados/juridico/${id}`);
}

export async function createAsociadoJuridico(asociado: Omit<AsociadoJuridico, 'Id_Asociado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<AsociadoJuridico> {
    const response = await apiAuth.post<AsociadoJuridico>("/asociados/juridico/create", {
        ...asociado,
        Fecha_Creacion: new Date().toISOString(),
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

export async function updateAsociadoJuridico(id: number, asociado: Partial<AsociadoJuridico>): Promise<AsociadoJuridico> {
    const response = await apiAuth.put<AsociadoJuridico>(`/asociados/juridico/${id}`, {
        ...asociado,
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}