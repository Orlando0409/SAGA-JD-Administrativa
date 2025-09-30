import type { Material } from "./Material";

export interface CategoriaMaterial {
  Id_Categoria: number;
  Nombre_Categoria: string;
  Descripcion_Categoria?: string;
  Estado_Categoria?: EstadoCategoria;
  Usuario_Creador?: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
  };
  Materiales?: Material[];
}

export interface EstadoCategoria {
  Id_Estado_Categoria: number;
  Nombre_Estado_Categoria: string;
  Categorias?: CategoriaMaterial[];
}

export interface MaterialCategoria {
  Id_Material_Categoria: number;
  Material: Material;
  Categoria: CategoriaMaterial;
}

export interface CreateCategoriaMaterialData {
  Nombre_Categoria: string;
  Descripcion_Categoria: string;
}

export interface UpdateCategoriaMaterialData {
  Nombre_Categoria?: string;
  Descripcion_Categoria?: string;
}