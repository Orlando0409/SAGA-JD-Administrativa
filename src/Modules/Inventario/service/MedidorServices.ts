import axiosPrivate from '@/Api/apiAuth';
import type { Medidor, CreateMedidorData } from '../models/Inventario';

// GET /Inventario/all/medidores
export const getAllMedidores = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/all/medidores`);
  return response.data;
};

// GET /Inventario/medidores/disponibles
export const getMedidoresDisponibles = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/disponibles`);
  return response.data;
};

// GET /Inventario/medidores/no-instalados
export const getMedidoresNoInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/no-instalados`);
  return response.data;
};

// GET /Inventario/medidores/instalados
export const getMedidoresInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/instalados`);
  return response.data;
};

// GET /Inventario/medidores/averiados
export const getMedidoresAveriados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/averiados`);
  return response.data;
};

// GET /Inventario/medidores/afiliado/:idAfiliado
export const getMedidoresAfiliado = async (idAfiliado: number): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/afiliado/${idAfiliado}`);
  return response.data;
};

// POST /Inventario/create/medidor
export const createMedidor = async (data: CreateMedidorData): Promise<Medidor> => {
  const response = await axiosPrivate.post(`/Inventario/create/medidor`, data);
  return response.data;
};

// POST /Inventario/asignar/medidor/afiliado
export const asignarMedidorAAfiliado = async (idMedidor: number, idAfiliado: number): Promise<void> => {
  await axiosPrivate.post(`/Inventario/asignar/medidor/afiliado`, { Id_Medidor: idMedidor, Id_Afiliado: idAfiliado });
};

// PATCH /Inventario/update/estado/medidor/:idMedidor/:nuevoEstadoId
export const updateEstadoMedidor = async (idMedidor: number, nuevoEstado: number): Promise<Medidor> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/medidor/${idMedidor}/${nuevoEstado}`);
  return response.data;
};
