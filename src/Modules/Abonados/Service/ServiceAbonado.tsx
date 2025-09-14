import apiAuth from "@/Api/apiAuth";
import type { Abonado } from "../Models/ModelAbonado";

export async function getAbonados(): Promise<Abonado[]> {
    const response = await apiAuth.get<Abonado[]>("/abonados/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

export async function deleteAbonado(id: number): Promise<void> {
    await apiAuth.delete(`/abonados/${id}`);
}

export async function createAbonado(abonado: Omit<Abonado, 'Id_Abonado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<Abonado> {
    const response = await apiAuth.post<Abonado>("/abonados", abonado);
    return response.data;
}

export async function updateAbonado(id: number, abonado: Partial<Abonado>): Promise<Abonado> {
    const response = await apiAuth.put<Abonado>(`/abonados/${id}`, abonado);
    return response.data;
}