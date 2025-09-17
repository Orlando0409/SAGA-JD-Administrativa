import apiAuth from "@/Api/apiAuth";
import type { AfiliadoFisico } from "../Models/ModeloAfiliadoFisico";
import axios from "axios";

export async function getAfiliadosFisicos(): Promise<AfiliadoFisico[]> {
    const response = await apiAuth.get<AfiliadoFisico[]>("/afiliados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}



// En tu Hook o Service
export const createAfiliadoFisico = async (formData: FormData) => {
    console.log("🚀 Hook - Enviando FormData:", formData);

    const response = await apiAuth.post("/afiliados/fisico/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // ✅ Importante
        },
    });

    return response.data;
};
/*
export async function createAfiliadoFisico(data: FormData) {
    const response = await apiAuth.post("/afiliados/fisico/create", data);
    return response.data;
}*/