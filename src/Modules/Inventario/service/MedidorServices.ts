import axiosPrivate from '@/Api/apiAuth';
import type { Medidor, CreateMedidorData } from '../models/Inventario';

// Obtener todos los medidores
export const getAllMedidores = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/all/medidores`);
  return response.data;
};

// Obtener medidores no instalados
export const getMedidoresNoInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/no-instalados`);
  return response.data;
};  

// Obtener medidores instalados
export const getMedidoresInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/instalados`);
  return response.data;
};

// Obtener medidores averiados
export const getMedidoresAveriados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/averiados`);
  return response.data;
};

// Obtener medidores de un afiliado
export const getMedidoresAfiliado = async (idAfiliado: number): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/afiliado/${idAfiliado}`);
  return response.data;
};

// Crear un nuevo medidor
export const createMedidor = async (data: CreateMedidorData, idUsuario: number): Promise<Medidor> => {
  const response = await axiosPrivate.post(`/Inventario/create/medidor/${idUsuario}`, data);
  return response.data;
};

// Actualizar el estado de un medidor
export const updateEstadoMedidor = async ( idMedidor: number, nuevoEstado: number, idUsuario: number ): Promise<Medidor> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/${idMedidor}/${nuevoEstado}/${idUsuario}`);
  return response.data;
};

