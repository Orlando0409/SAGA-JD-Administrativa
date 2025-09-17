import apiAuth from "@/Api/apiAuth";
import type { AfiliacionJuridica } from "../Models/ModelSolicitudAfiliadoJuridico";

export async function getAfiliadosJuridicos(): Promise<AfiliacionJuridica[]> {
    const response = await apiAuth.get<AfiliacionJuridica[]>("/afiliados/juridico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}
