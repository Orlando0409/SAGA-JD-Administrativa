import axiosPrivate from '@/Api/apiAuth';
import type { 
  UnidadMedicion,
  UnidadMedicionSimple,
  CreateUnidadMedicionData,
  UpdateUnidadMedicionData,
} from '../models/Inventario';

// Transform functions to handle field name differences between frontend and backend
const transformUnidadMedicion = (unidad: any): UnidadMedicion => {
  return {
    ...unidad,
    // Support both field names for maximum compatibility
    Nombre_Unidad_Medicion: unidad.Nombre_Unidad_Medicion,
    Nombre_Unidad: unidad.Nombre_Unidad
  };
};

const transformUnidadMedicionSimple = (unidad: any): UnidadMedicionSimple => {
  return {
    Id_Unidad_Medicion: unidad.Id_Unidad_Medicion,
    // Support both field names for maximum compatibility
    Nombre_Unidad_Medicion: unidad.Nombre_Unidad_Medicion,
    Nombre_Unidad: unidad.Nombre_Unidad
  };
};

export const getAllUnidadesMedicion = async (): Promise<UnidadMedicion[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion');
  return response.data.map(transformUnidadMedicion);
};

export const getAllUnidadesMedicionSimple = async (): Promise<UnidadMedicionSimple[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion/simple');
  return response.data.map(transformUnidadMedicionSimple);
};

export const getUnidadesMedicionActivas = async (): Promise<UnidadMedicion[]> => {
  const response = await axiosPrivate.get('/Inventario/unidades-medicion/activas');
  return response.data.map(transformUnidadMedicion);
};

export const getUnidadesMedicionInactivas = async (): Promise<UnidadMedicion[]> => {
  const response = await axiosPrivate.get('/Inventario/unidades-medicion/inactivas');
  return response.data.map(transformUnidadMedicion);
};

export const getUnidadMedicionById = async (id: number): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.get(`/Inventario/unidad-medicion/${id}`);
  return transformUnidadMedicion(response.data);
};

export const createUnidadMedicion = async (unidadData: CreateUnidadMedicionData, idUsuarioCreador: number): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.post(`/Inventario/create/unidad-medicion/${idUsuarioCreador}`, unidadData);
  return transformUnidadMedicion(response.data);
};

export const updateUnidadMedicion = async (id: number, unidadData: UpdateUnidadMedicionData): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.put(`/Inventario/update/unidad-medicion/${id}`, unidadData);
  return transformUnidadMedicion(response.data);
};

export const updateEstadoUnidadMedicion = async (unidadId: number, estadoUnidad:number): Promise<UnidadMedicion> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/unidad-medicion/${unidadId}/${estadoUnidad}`);
  return transformUnidadMedicion(response.data);
};

export const deleteUnidadMedicion = async (id: number): Promise<{ message: string }> => {
  const response = await axiosPrivate.delete(`/Inventario/delete/unidad-medicion/${id}`);
  return response.data;
};