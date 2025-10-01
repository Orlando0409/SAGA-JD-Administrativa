import axiosPrivate from '@/Api/apiAuth';
import type { 
  Material, 
  IngresoEgresoMaterialData
} from '../models/Inventario';

const transformMaterial = (material: Material) => {
  return {
    ...material,
    Categorias: material.Categorias?.map((catItem: any) => catItem.Categoria) || []
  };
};

export const ingresoMaterial = async (materialId: number, ingresoData: IngresoEgresoMaterialData): Promise<Material> => {
  const response = await axiosPrivate.patch(`/Inventario/ingreso/material/${materialId}`, ingresoData);
  return transformMaterial(response.data);
};

export const egresoMaterial = async (materialId: number, egresoData: IngresoEgresoMaterialData): Promise<Material> => {
  const response = await axiosPrivate.patch(`/Inventario/egreso/material/${materialId}`, egresoData);
  return transformMaterial(response.data);
};
