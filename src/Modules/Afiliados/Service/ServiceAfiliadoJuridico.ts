import apiAuth from "@/Api/apiAuth";
import type { AfiliadoJuridico } from "../Models/TablaAfiliados/ModeloAfiliadoJuridico";

// GET /afiliados/juridico/all
export async function getAfiliadosJuridicos(): Promise<AfiliadoJuridico[]> {
    const response = await apiAuth.get<AfiliadoJuridico[]>("/afiliados/juridico/all");
    return response.data;
}

// GET /afiliados/juridico/detail/:id
export async function getAfiliadoJuridicoById(id: number): Promise<AfiliadoJuridico> {
    const response = await apiAuth.get<AfiliadoJuridico>(`/afiliados/juridico/detail/${id}`);
    return response.data;
}

// POST /afiliados/juridico/create
export const createAfiliadoJuridico = async (formData: FormData) => {
    const response = await apiAuth.post("/afiliados/juridico/create", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// PUT /afiliados/update/juridico/:cedulaJuridica
export const updateAfiliadoJuridico = async (cedulaJuridica: string, formData: FormData) => {
    const response = await apiAuth.put(`/afiliados/update/juridico/${cedulaJuridica}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// PATCH /afiliados/juridico/:id/update/estado/:nuevoEstadoId
export const updateEstadoAfiliadoJuridico = async (id: string, nuevoEstadoId: number) => {
    const response = await apiAuth.patch(`/afiliados/juridico/${id}/update/estado/${nuevoEstadoId}`);
    return response.data;
};

// PATCH /afiliados/update/tipo/juridico/:id/tipo/:nuevoTipoId
export const updateTipoAfiliadoJuridico = async (id: number, nuevoTipoId: number) => {
    const response = await apiAuth.patch(`/afiliados/update/tipo/juridico/${id}/tipo/${nuevoTipoId}`);
    return response.data;
};