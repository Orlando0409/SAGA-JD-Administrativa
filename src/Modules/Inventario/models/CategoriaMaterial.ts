import type { Material } from "./Material";

export interface CategoriaMaterial {
  Id_Categoria: number;
  Nombre_Categoria: string;
  Materiales?: Material[];
}

export interface MaterialCategoria {
  Id_Material_Categoria: number;
  Material: Material;
  Categoria: CategoriaMaterial;
}

export interface CreateCategoriaMaterialData {
  Nombre_Categoria: string;
}

export interface UpdateCategoriaMaterialData {
  Nombre_Categoria?: string;
}