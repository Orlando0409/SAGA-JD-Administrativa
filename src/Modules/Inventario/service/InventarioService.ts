import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  CategoriaMaterial,
  CreateCategoriaMaterialData
} from '../models/Inventario';


const transformMaterial = (material: Material) => {
  return {
    ...material,
    Categorias: material.Categorias?.map((catItem: any) => catItem.Categoria) || []
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

export const getAllCategories = async (): Promise<CategoriaMaterial[]> => {
  const response = await axiosPrivate.get('/Inventario/all/categorias');
  return response.data;
};

export const getMaterialsWithStock = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/with/categorias');
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


export const createCategoria = async (categoriaData: CreateCategoriaMaterialData): Promise<CategoriaMaterial> => {
  const response = await axiosPrivate.post('/Inventario/create/categoria', categoriaData);
  return response.data;
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

export const addCategoriaToMaterial = async (materialId: number, categoriaId: number): Promise<Material> => {
  const response = await axiosPrivate.post(`/Inventario/add/material/${materialId}/${categoriaId}`);
  return transformMaterial(response.data);
};

export const removeCategoriaFromMaterial = async (materialId: number, categoriaId: number): Promise<Material> => {
  const response = await axiosPrivate.delete(`/Inventario/remove/material/${materialId}/${categoriaId}`);
  return transformMaterial(response.data);
};