import axiosPrivate from '@/Api/apiAuth';
import type { Medidor, CreateMedidorData } from '../models/Inventario';

// Obtener todos los medidores
export const getAllMedidores = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/all/medidores`);
  console.log('getAllMedidores response:', response.data);
  return response.data;
};

// Obtener medidores no instalados
export const getMedidoresNoInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/no-instalados`);
  return response.data;
};

// Obtener medidores disponibles (sin asignar)
export const getMedidoresDisponibles = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/no-instalados`);
  return response.data;
};

// Obtener medidores instalados
export const getMedidoresInstalados = async (): Promise<Medidor[]> => {
  const response = await axiosPrivate.get(`/Inventario/medidores/instalados`);
  console.log('getMedidoresInstalados response:', response.data);
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
export const createMedidor = async (data: CreateMedidorData): Promise<Medidor> => {
  const response = await axiosPrivate.post(`/Inventario/create/medidor/`, data);
  return response.data;
};

// Actualizar el estado de un medidor
export const updateEstadoMedidor = async (idMedidor: number, nuevoEstado: number): Promise<Medidor> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/medidor/${idMedidor}/${nuevoEstado}/`);
  return response.data;
};

// Asignar medidor existente a un afiliado
export const asignarMedidorAAfiliado = async (idMedidor: number, idAfiliado: number): Promise<void> => {
  await axiosPrivate.post(`/Inventario/asignar/medidor/afiliado`, { Id_Medidor: idMedidor, Id_Afiliado: idAfiliado });
};

// Asignar medidor a un afiliado con archivos de documentos del terreno
export const asignarMedidorConArchivos = async (
  idMedidor: number,
  idAfiliado: number,
  escrituraFile: File,
  planosFile: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('Id_Medidor', String(idMedidor));
  formData.append('Id_Afiliado', String(idAfiliado));
  formData.append('Escritura_Terreno', escrituraFile);
  formData.append('Planos_Terreno', planosFile);
  await axiosPrivate.post(`/Inventario/asignar/medidor/afiliado`, formData);
};

