import apiAuth from "@/Api/apiAuth";
import type { ProveedorFisico } from "../Models/TablaProveedo/proveedorFisico";


export const getProveedoresFisicos = async (): Promise<ProveedorFisico[]> => {
  const res = await apiAuth.get("/Proveedores/fisico/");
  return res.data;
};



