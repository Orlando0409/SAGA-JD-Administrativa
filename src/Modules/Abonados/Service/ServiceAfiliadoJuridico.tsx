import apiAuth from "@/Api/apiAuth";
import type { AfiliadoJuridico } from "../Models/ModeloAfiliadoJuridico";

export async function getAfiliadosJuridicos(): Promise<AfiliadoJuridico[]> {
    const response = await apiAuth.get<AfiliadoJuridico[]>("/afiliados/juridico/all");
    console.log('Response del API:', response.data); // 🔍 Debug
    return response.data;
}