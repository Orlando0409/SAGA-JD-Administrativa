import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  CategoriaMaterial,
  CreateCategoriaMaterialData,
  UnidadMedicion,
  UnidadMedicionSimple,
  CreateUnidadMedicionData,
  UpdateUnidadMedicionData,
  IngresoEgresoMaterialData
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

// ========== SERVICIOS DE UNIDADES DE MEDICIÓN ==========
export const getAllUnidadesMedicion = async (): Promise<UnidadMedicion[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion');
  return response.data;
};

export const getAllUnidadesMedicionSimple = async (): Promise<UnidadMedicionSimple[]> => {
  const response = await axiosPrivate.get('/Inventario/all/unidades-medicion/simple');
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

// ========== SERVICIOS DE INGRESO/EGRESO ==========
export const ingresoMaterial = async (materialId: number, ingresoData: IngresoEgresoMaterialData): Promise<Material> => {
  const response = await axiosPrivate.patch(`/Inventario/ingreso/material/${materialId}`, ingresoData);
  return transformMaterial(response.data);
};

export const egresoMaterial = async (materialId: number, egresoData: IngresoEgresoMaterialData): Promise<Material> => {
  const response = await axiosPrivate.patch(`/Inventario/egreso/material/${materialId}`, egresoData);
  return transformMaterial(response.data);
};