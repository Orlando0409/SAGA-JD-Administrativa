import apiAuth from "@/Api/apiAuth";
import type { Manual } from "../Models/ModelsManuales";

// Obtener todos los manuales
export const getManuales = async (): Promise<Manual[]> => {
    const res = await apiAuth.get("/manual");
    return res.data;
};
