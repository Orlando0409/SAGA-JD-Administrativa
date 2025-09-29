import axiosPrivate from '@/Api/apiAuth';
import type { 
  UnidadMedicion,
  UnidadMedicionSimple,
  CreateUnidadMedicionData,
  UpdateUnidadMedicionData,
} from '../models/Inventario';

export const getAllUnidadesMedicion = async (): Promise<UnidadMedicion[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion');
  return response.data;
};

export const getAllUnidadesMedicionSimple = async (): Promise<UnidadMedicionSimple[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion/simple');
  return response.data;
};

export const getUnidadMedicionById = async (id: number): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.get(`/Inventario/unidad-medicion/${id}`);
  return response.data;
};

export const createUnidadMedicion = async (unidadData: CreateUnidadMedicionData): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.post('/Inventario/create/unidad-medicion', unidadData);
  return response.data;
};

export const updateUnidadMedicion = async (id: number, unidadData: UpdateUnidadMedicionData): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.put(`/Inventario/update/unidad-medicion/${id}`, unidadData);
  return response.data;
};

export const updateEstadoUnidadMedicion = async (unidadId: number, estadoId: number): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/unidad-medicion/${unidadId}/${estadoId}`);
  return response.data;
};

export const deleteUnidadMedicion = async (id: number): Promise<{ message: string }> => {
  const response = await axiosPrivate.delete(`/Inventario/delete/unidad-medicion/${id}`);
  return response.data;
};