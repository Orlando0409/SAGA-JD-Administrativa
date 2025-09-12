import apiAuth from "@/Api/apiAuth";
import type { AbonadoJuridico } from "../Models/ModeloAbonadoJuridico";

export async function getAbonadosJuridicos(): Promise<AbonadoJuridico[]> {
    const response = await apiAuth.get<AbonadoJuridico[]>("/abonados/juridico/all");
    console.log('Response del API Jurídicos:', response.data); // 🔍 Debug
    return response.data;
}

export async function deleteAbonadoJuridico(id: number): Promise<void> {
    await apiAuth.delete(`/abonados/juridico/${id}`);
}

export async function createAbonadoJuridico(abonado: Omit<AbonadoJuridico, 'Id_Abonado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>): Promise<AbonadoJuridico> {
    const response = await apiAuth.post<AbonadoJuridico>("/abonados/juridico/create", {
        ...abonado,
        Fecha_Creacion: new Date().toISOString(),
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}

export async function updateAbonadoJuridico(id: number, abonado: Partial<AbonadoJuridico>): Promise<AbonadoJuridico> {
    const response = await apiAuth.put<AbonadoJuridico>(`/abonados/juridico/${id}`, {
        ...abonado,
        Fecha_Actualizacion: new Date().toISOString(),
    });
    return response.data;
}