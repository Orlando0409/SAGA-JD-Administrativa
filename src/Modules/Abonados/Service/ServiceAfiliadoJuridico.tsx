import apiAuth from "@/Api/apiAuth";
import type { AfiliadoJuridico } from "../Models/ModeloAfiliadoJuridico";


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

/*
export async function createAfiliadoJuridico(data: FormData) {
    const response = await apiAuth.post("/afiliados/juridico/create", data);
    console.log('Response del API:', response.data); // 🔍 Debug  console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;

}*/