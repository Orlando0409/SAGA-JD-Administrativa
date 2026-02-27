import apiAuth from "@/Api/apiAuth";
import type { AfiliadoFisico } from "../Models/TablaAfiliados/ModeloAfiliadoFisico";

// GET /afiliados/fisico/all
export async function getAfiliadosFisicos(): Promise<AfiliadoFisico[]> {
    const response = await apiAuth.get<AfiliadoFisico[]>("/afiliados/fisico/all");
    return response.data;
}

// GET /afiliados/fisico/detail/:id
export async function getAfiliadoFisicoById(id: number): Promise<AfiliadoFisico> {
    const response = await apiAuth.get<AfiliadoFisico>(`/afiliados/fisico/detail/${id}`);
    return response.data;
}

// POST /afiliados/fisico/create
export const createAfiliadoFisico = async (formData: FormData) => {
    const response = await apiAuth.post("/afiliados/fisico/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// PUT /afiliados/update/fisico/:cedula
export const updateAfiliadoFisico = async (cedula: string, formData: FormData) => {
    const response = await apiAuth.put(`/afiliados/update/fisico/${cedula}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// PATCH /afiliados/fisico/:id/update/estado/:nuevoEstadoId
export const updateEstadoAfiliadoFisico = async (id: string, nuevoEstadoId: number) => {
    const response = await apiAuth.patch(`/afiliados/fisico/${id}/update/estado/${nuevoEstadoId}`);
    return response.data;
};

// PATCH /afiliados/update/tipo/fisico/:id/tipo/:nuevoTipoId
export const updateTipoAfiliadoFisico = async (id: number, nuevoTipoId: number) => {
    const response = await apiAuth.patch(`/afiliados/update/tipo/fisico/${id}/tipo/${nuevoTipoId}`);
    return response.data;
};