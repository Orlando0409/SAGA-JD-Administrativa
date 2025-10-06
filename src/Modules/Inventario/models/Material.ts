import type { CategoriaMaterial } from "./CategoriaMaterial";
import type { UnidadMedicion } from "./UnidadMedicion";


export interface Material {
  Id_Material: number;
  Nombre_Material: string;
  Descripcion?: string;
  Cantidad: number;
  Precio_Unitario: number;
  Fecha_Entrada: Date | string;
  Fecha_Actualizacion: Date | string;
  Fecha_Salida?: Date | string | null;
  Fecha_Baja?: Date | string | null;
  Estado_Material: EstadoMaterial;
  Unidad_Medicion: UnidadMedicion;
  materialCategorias: {
    Id_Material_Categoria: number;
    Categoria: CategoriaMaterial;
  }[];
  Categorias?: {
    Id_Material_Categoria: number;
    Categoria: CategoriaMaterial;
  }[];
}

export interface CreateMaterialData {
  Nombre_Material: string;
  Descripcion?: string;
  Id_Unidad_Medicion: number;
  Cantidad: number;
  Precio_Unitario: number;
  IDS_Categorias?: number[];
}

export interface UpdateMaterialData {
  Nombre_Material?: string;
  Descripcion?: string;
  Id_Unidad_Medicion?: number;
  Precio_Unitario?: number;
  IDS_Categorias?: number[];
}

export interface EstadoMaterial {
  Id_Estado_Material: number;
  Nombre_Estado_Material: string;
  Materiales?: Material[];
}