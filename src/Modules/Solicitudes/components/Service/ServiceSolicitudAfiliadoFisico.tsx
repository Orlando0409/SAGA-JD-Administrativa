import apiAuth from "@/Api/apiAuth";
import type { AfiliacionFisica } from "../Models/ModelSolicitudAfiliadoFisico";

export async function getAfiliadosFisicos(): Promise<AfiliacionFisica[]> {
    const response = await apiAuth.get<AfiliacionFisica[]>("/afiliados/fisico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}
