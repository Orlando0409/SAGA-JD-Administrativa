import type { CategoriaMaterial, MaterialCategoria } from "./CategoriaMaterial";
import type { EstadoMaterial } from "./EstadoMaterial";
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
  Id_Estado_Material?: number;
  Estado_Material: EstadoMaterial;
  Id_Unidad_Medicion: number;
  Unidad_Medicion: UnidadMedicion;
  materialCategorias: MaterialCategoria[];
  Categorias?: CategoriaMaterial[];
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
  Cantidad?: number;
  Precio_Unitario?: number;
  IDS_Categorias?: number[];
}