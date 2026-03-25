import apiAuth from "@/Api/apiAuth";
import type { AfiliadoJuridico } from "../Models/TablaAfiliados/ModeloAfiliadoJuridico";

export async function getAfiliadosJuridicos(): Promise<AfiliadoJuridico[]> {
    const response = await apiAuth.get<AfiliadoJuridico[]>("/afiliados/juridico/all");
    console.log('Response del API:', response.data); 
    return response.data;
}

export async function getAfiliadoJuridicoById(id: number): Promise<AfiliadoJuridico> {
    const response = await apiAuth.get<AfiliadoJuridico>(`/afiliados/juridico/${id}`);
    return response.data;
}

export async function getAfiliadoJuridicoDetail(id: number): Promise<AfiliadoJuridico> {
    const response = await apiAuth.get<AfiliadoJuridico>(`/afiliados/juridico/detail/${id}`);
    return response.data;
}

export const createAfiliadoJuridico = async (formData: FormData) => {
    console.log(" Hook - Enviando FormData:", formData);

    const response = await apiAuth.post("/afiliados/juridico/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });

    return response.data;
};

export const updateAfiliadoJuridico = async (cedulaJuridica: string, formData: FormData) => {
    console.log("🔄 Hook - Actualizando FormData:", formData);

    const response = await apiAuth.put(`/afiliados/update/juridico/${cedulaJuridica}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updateEstadoAfiliadoJuridico = async (id: string, nuevoEstadoId: number) => {
    const response = await apiAuth.patch(`/afiliados/juridico/${id}/update/estado/${nuevoEstadoId}`);
    return response.data;
};

export const updateTipoAfiliadoJuridico = async (
    id: number,
    nuevoTipoId: number,
    archivos?: {
        Planos_Terreno?: File;
        Escrituras_Terreno?: File;
    }
) => {
    const formData = new FormData();

    if (archivos?.Planos_Terreno) {
        formData.append('Planos_Terreno', archivos.Planos_Terreno);
    }

    if (archivos?.Escrituras_Terreno) {
        formData.append('Escrituras_Terreno', archivos.Escrituras_Terreno);
    }

    const response = await apiAuth.patch(
        `/afiliados/update/tipo/juridico/${id}/tipo/${nuevoTipoId}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};