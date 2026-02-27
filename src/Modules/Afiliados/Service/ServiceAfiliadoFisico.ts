import apiAuth from "@/Api/apiAuth";
import type { AfiliadoFisico, Medidor } from "../Models/TablaAfiliados/ModeloAfiliadoFisico";

export async function getAfiliadosFisicos(): Promise<AfiliadoFisico[]> {
    const response = await apiAuth.get<AfiliadoFisico[]>("/afiliados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

export async function getAfiliadoFisicoById(id: number): Promise<AfiliadoFisico> {
    const response = await apiAuth.get<AfiliadoFisico>(`/afiliados/fisico/${id}`);
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

export interface MedidorAsignable {
    Id_Medidor: number;
    Numero_Medidor: number;
    Estado_Medidor: {
        Id_Estado_Medidor: number;
        Nombre_Estado_Medidor: string;
    };
}

export const getMedidoresAsignables = async (): Promise<MedidorAsignable[]> => {
    const response = await apiAuth.get<MedidorAsignable[]>('/Inventario/medidores/asignables');
    return response.data;
};

// Extrae el array de medidores de cualquier estructura que devuelva el backend
const parsearMedidores = (data: unknown): Medidor[] => {
    if (Array.isArray(data)) return data as Medidor[];
    if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        for (const key of ['medidores', 'Medidores', 'data', 'items', 'result']) {
            if (Array.isArray(obj[key])) return obj[key] as Medidor[];
        }
        // Buscar el primer array como último recurso
        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) return obj[key] as Medidor[];
        }
    }
    return [];
};

export const getMedidoresByAfiliado = async (idAfiliado: number): Promise<Medidor[]> => {
    const response = await apiAuth.get(`/afiliados/${idAfiliado}/medidores`);
    return parsearMedidores(response.data);
};

export const asignarMedidorAAfiliado = async (idAfiliado: number, idMedidor: number): Promise<void> => {
    await apiAuth.patch(`/afiliados/${idAfiliado}/medidores/${idMedidor}/asignar`);
};