import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
} from '../models/Inventario';

const transformMaterial = (material: any) => {
  return {
    ...material,
    materialCategorias: material.materialCategorias || [],
    Categorias: material.materialCategorias || material.Categorias || []
  };
};

export const getAllMaterials = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/all/materiales');
  return response.data.map(transformMaterial);
};

// Note: Backend doesn't have individual material endpoint
// This method might need to filter from getAllMaterials or backend needs to add the endpoint
export const getMaterialById = async (id: number): Promise<Material> => {
  // Temporary workaround: get all materials and filter
  const allMaterials = await getAllMaterials();
  const material = allMaterials.find(m => m.Id_Material === id);
  if (!material) {
    throw new Error(`Material with ID ${id} not found`);
  }
  return material;
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

export const getMaterialesDisponibles = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/disponibles');
  return response.data.map(transformMaterial);
};

export const getMaterialesAgotados = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/agotados');
  return response.data.map(transformMaterial);
};

export const getMaterialesDeBaja = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/de-baja');
  return response.data.map(transformMaterial);
};

export const getMaterialesAgotadosYDeBaja = async (): Promise<Material[]> => {
  const response = await axiosPrivate.get('/Inventario/materiales/agotados-de-baja');
  return response.data.map(transformMaterial);
};

export const getMaterialesEntreRangoPrecio = async (min: number, max: number): Promise<Material[]> => {
  const response = await axiosPrivate.get(`/Inventario/materiales/between/priceRange/${min}/${max}`);
  return response.data.map(transformMaterial);
};

export const createMaterial = async (materialData: CreateMaterialData, idUsuarioCreador: number): Promise<Material> => {
  const response = await axiosPrivate.post(`/Inventario/create/material/${idUsuarioCreador}`, materialData);
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

export const updateEstadoMaterial = async (materialId: number, estadoMaterialId: number): Promise<Material> => {
  const response = await axiosPrivate.patch(`/Inventario/update/estado/material/${materialId}/${estadoMaterialId}`);
  return transformMaterial(response.data);
};
