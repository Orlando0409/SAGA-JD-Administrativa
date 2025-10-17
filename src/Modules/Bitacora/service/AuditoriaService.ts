import axiosPrivate from "@/Api/apiAuth";
import type { Auditoria } from "../models/Auditoria";


export const obtenerAuditorias = async (): Promise<Auditoria[]> => {
const response = await axiosPrivate.get("/auditoria/all");
return response.data;
};

export const obtenerAuditoriaPorModulo = async (modulo: string): Promise<Auditoria[]> => {
const response = await axiosPrivate.get(`/auditoria/modulo/${modulo}`);
return response.data;
};

export const obtenerAuditoriaPorUsuario = async (idUsuario: number): Promise<Auditoria[]> => {
const response = await axiosPrivate.get(`/auditoria/usuario/${idUsuario}`);
return response.data;
}

export const obtenerAuditoriaPorRegistro = async (modulo:string,idRegistro: number): Promise<Auditoria[]> => {
const response = await axiosPrivate.get(`/auditoria/registro/${modulo}/${idRegistro}`);
return response.data;
}