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

// Tipo de medidor tal como lo devuelve el backend en el detalle
type MedidorBackend = {
    Id_Medidor: number;
    Numero_Medidor: number;
    Estado?: { Id_Estado: number; Nombre_Estado: string };
    Estado_Medidor?: { Id_Estado_Medidor: number; Nombre_Estado_Medidor: string };
    Certificacion_Literal?: string | null;
    Planos_Terreno?: string | null;
};

// Mapea la respuesta del backend al formato del frontend
const mapearMedidoresDetalle = (medidores: MedidorBackend[]): Medidor[] =>
    medidores.map((m) => ({
        Id_Medidor: m.Id_Medidor,
        Numero_Medidor: m.Numero_Medidor,
        Estado_Medidor: m.Estado_Medidor ?? (m.Estado ? {
            Id_Estado_Medidor: m.Estado.Id_Estado,
            Nombre_Estado_Medidor: m.Estado.Nombre_Estado,
        } : undefined),
        Certificacion_Literal: m.Certificacion_Literal ?? null,
        Planos_Terreno: m.Planos_Terreno ?? null,
    }));

export const getMedidoresByAfiliado = async (idAfiliado: number): Promise<Medidor[]> => {
    const response = await apiAuth.get(`/afiliados/fisico/detail/${idAfiliado}`);
    const data = response.data as { Medidores?: MedidorBackend[] };
    return mapearMedidoresDetalle(data.Medidores ?? []);
};

export const getMedidoresByAfiliadoJuridico = async (idAfiliado: number): Promise<Medidor[]> => {
    const response = await apiAuth.get(`/afiliados/juridico/detail/${idAfiliado}`);
    const data = response.data as { Medidores?: MedidorBackend[] };
    return mapearMedidoresDetalle(data.Medidores ?? []);
};

export const asignarMedidorAAfiliado = async (idAfiliado: number, idMedidor: number): Promise<void> => {
    await apiAuth.patch(`/afiliados/${idAfiliado}/medidores/${idMedidor}/asignar`);
};