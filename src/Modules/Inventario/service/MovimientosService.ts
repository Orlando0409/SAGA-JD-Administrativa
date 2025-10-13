import axiosPrivate from '@/Api/apiAuth';
import type { 
  IngresoEgresoMaterialData
} from '../models/Inventario';

// Updated to match backend controller endpoints
export const ingresoMaterial = async (idUsuario: number, ingresoData: IngresoEgresoMaterialData): Promise<any> => {
  const response = await axiosPrivate.post(`/Inventario/ingreso/material/${idUsuario}`, ingresoData);
  return response.data;
};

export const egresoMaterial = async (idUsuario: number, egresoData: IngresoEgresoMaterialData): Promise<any> => {
  const response = await axiosPrivate.post(`/Inventario/egreso/material/${idUsuario}`, egresoData);
  return response.data;
};

// Add the new endpoint for getting all movements
export const getAllMovimientos = async (): Promise<any[]> => {
  const response = await axiosPrivate.get('/Inventario/all/movimientos');
  return response.data;
};

export const getMovimientosEntradas = async (): Promise<any[]> => {
  const response = await axiosPrivate.get('/Inventario/movimientos/entradas');
  return response.data;
};

export const getMovimientosSalidas = async (): Promise<any[]> => {
  const response = await axiosPrivate.get('/Inventario/movimientos/salidas');
  return response.data;
};

export const getMovimientosEntreFechas = async (startDate: string, endDate: string): Promise<any[]> => {
  const response = await axiosPrivate.get(`/Inventario/movimientos/entre/fechas/${startDate}/${endDate}`);
  return response.data;
};

export const getMovimientosPorUsuarioCreador = async (idUsuarioCreador: number): Promise<any[]> => {
  const response = await axiosPrivate.get(`/Inventario/movimientos/${idUsuarioCreador}`);
  return response.data;
};
