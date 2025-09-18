import apiAuth from "@/Api/apiAuth";
import type { AfiliadoFisico } from "../Models/ModeloAfiliadoFisico";

export async function getAfiliadosFisicos(): Promise<AfiliadoFisico[]> {
    const response = await apiAuth.get<AfiliadoFisico[]>("/afiliados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}