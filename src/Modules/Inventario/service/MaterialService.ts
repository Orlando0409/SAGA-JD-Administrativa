import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
} from '../models/Inventario';

const transformMaterial = (material: any) => {
  return {
    ...material,
    // Use the correct property name from backend
    Categorias: material.Categorias || material.materialCategorias || []
  };
};

export const getAllMaterials = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/all/materiales');
  return response.data.map(transformMaterial);
};

export const getMaterialById = async (id: number): Promise<Material> => {
  const response = await axiosPrivate.get(`/Inventario/material/${id}`);
  return transformMaterial(response.data);
};

export const getMaterialesConCategorias = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/with/categorias');
  return response.data.map(transformMaterial);
};

export const getMaterialesSinCategorias = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/without/categorias');
  return response.data.map(transformMaterial);
};

export const getMaterialesPorEncimaDeStock = async (threshold: number): Promise<Material[]> => {
  const response = await axiosPrivate.get(`/Inventario/materiales/above/stock/${threshold}`);
  return response.data.map(transformMaterial);
};

export const getMaterialesPorDebajoDeStock = async (threshold: number): Promise<Material[]> => {
  const response = await axiosPrivate.get(`/Inventario/materiales/below/stock/${threshold}`);
  return response.data.map(transformMaterial);
};

export const createMaterial = async (materialData: CreateMaterialData): Promise<Material> => {
  const response = await axiosPrivate.post('/Inventario/create/material', materialData);
  return transformMaterial(response.data);
};

export const updateMaterial = async (id: number, materialData: UpdateMaterialData): Promise<Material> => {
  const response = await axiosPrivate.put(`/Inventario/update/material/${id}`, materialData);
  return transformMaterial(response.data);
};

export const removeCategoriaFromMaterial = async (materialId: number, categoriaId: number): Promise<Material> => {
  const response = await axiosPrivate.delete(`/Inventario/material/${materialId}/categoria/${categoriaId}`);
  return transformMaterial(response.data);
};
