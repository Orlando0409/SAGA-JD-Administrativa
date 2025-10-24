import axiosPrivate from '@/Api/apiAuth';
import type { 
  CategoriaMaterial,
  CreateCategoriaMaterialData,
  UpdateCategoriaMaterialData
} from '../models/Inventario';

export const getAllCategories = async (): Promise<CategoriaMaterial[]> => {
  const response = await axiosPrivate.get('/Inventario/all/categorias');
  return response.data;
};

export const getCategoriasActivas = async (): Promise<CategoriaMaterial[]> => {
  const response = await axiosPrivate.get('/Inventario/categorias/activas');
  return response.data;
};

export const getCategoriasInactivas = async (): Promise<CategoriaMaterial[]> => {
  const response = await axiosPrivate.get('/Inventario/categorias/inactivas');
  return response.data;
};

export const getCategoriaById = async (id: number): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.get(`/Inventario/categoria/${id}`);
  return response.data;
};

export const createCategoria = async (categoriaData: CreateCategoriaMaterialData): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.post(`/Inventario/create/categoria/`, categoriaData);
  return response.data;
};

export const updateCategoria = async (id: number, categoriaData: UpdateCategoriaMaterialData): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.put(`/Inventario/update/categoria/${id}/`, categoriaData);
  return response.data;
};

export const updateEstadoCategoria = async (id: number, estadoId: number): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/categoria/${id}/${estadoId}/`);
  return response.data;
};