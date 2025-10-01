import apiAuth from "@/Api/apiAuth";
import type { AfiliadoJuridico } from "../Models/TablaAfiliados/ModeloAfiliadoJuridico";

export async function getAfiliadosJuridicos(): Promise<AfiliadoJuridico[]> {
    const response = await apiAuth.get<AfiliadoJuridico[]>("/afiliados/juridico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}

export const createAfiliadoJuridico = async (formData: FormData) => {
    console.log("🚀 Hook - Enviando FormData:", formData);

    const response = await apiAuth.post("/afiliados/juridico/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // ✅ Importante
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