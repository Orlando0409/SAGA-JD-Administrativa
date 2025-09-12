
import type { Abonado } from "../Models/ModeloAbonadoFisico";
import apiAuth from "@/Api/apiAuth";

export async function getAbonados(): Promise<Abonado[]> {
    const response = await apiAuth.get<Abonado[]>("/abonados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

export async function deleteAbonado(id: number): Promise<void> {
    await apiAuth.delete(`/abonados/${id}`);
}

export async function createAbonado(abonado: Omit<Abonado, 'Id_Abonado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<Abonado> {
    const response = await apiAuth.post<Abonado>("/abonados/create", {
        ...abonado,
        Fecha_Creacion: new Date().toISOString(),
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

export async function updateAbonado(id: number, abonado: Partial<Abonado>): Promise<Abonado> {
    const response = await apiAuth.put<Abonado>(`/abonados/${id}`, {
        ...abonado,
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

/*
export async function createAfiliacionJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitud-afiliacion-juridica/create", data);
    return response.data; 
}*/