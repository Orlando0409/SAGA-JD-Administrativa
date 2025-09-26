import type { Material } from "./Material";

export interface CategoriaMaterial {
  Id_Categoria_Material: number;
  Nombre_Categoria_Material: string;
  Materiales?: Material[];
}

export interface CreateCategoriaMaterialData {
  Nombre_Categoria: string;
}

export interface UpdateCategoriaMaterialData {
  Nombre_Categoria?: string;
}