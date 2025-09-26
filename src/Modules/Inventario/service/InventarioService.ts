import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  CategoriaMaterial,
  CreateCategoriaMaterialData
} from '../models/Inventario';

export const getAllMaterials = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/all/materiales');
  return response.data;
};

export const getMaterialById = async (id: number): Promise<Material> => {
  const response = await axiosPrivate.get(`/Inventario/material/${id}`);
  return response.data;
};

export const getAllCategories = async (): Promise<CategoriaMaterial[]> => {
  const response = await axiosPrivate.get('/Inventario/all/categorias');
  return response.data;
};

export const getMaterialsWithStock = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/con-stock');
  return response.data;
};

export const createMaterial = async (materialData: CreateMaterialData): Promise<Material> => {
  const response = await axiosPrivate.post('/Inventario/create/material', materialData);
  return response.data;
};

export const updateMaterial = async (id: number, materialData: UpdateMaterialData): Promise<Material> => {
  const response = await axiosPrivate.put(`/Inventario/update/material/${id}`, materialData);
  return response.data;
};

export const deleteMaterial = async (id: number): Promise<void> => {
  await axiosPrivate.delete(`/Inventario/delete/material/${id}`);
};

export const createCategoria = async (categoriaData: CreateCategoriaMaterialData): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.post('/Inventario/create/categoria', categoriaData);
  return response.data;
};