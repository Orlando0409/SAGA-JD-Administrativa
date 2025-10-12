import type { CategoriaMaterial } from "./CategoriaMaterial";
import type { UnidadMedicion } from "./UnidadMedicion";

// Tipo para representar un proveedor (físico o jurídico) según estructura del backend
export interface Proveedor {
  Id_Proveedor: number;
  Id_Tipo_Proveedor: number; // 1 = Físico, 2 = Jurídico
  Nombre_Proveedor: string; // Presente en ambos tipos
  Telefono_Proveedor: string;
  
  // Campos específicos de Proveedor Físico (Id_Tipo_Proveedor = 1)
  Tipo_Identificacion?: string; // "Cédula", "Pasaporte", etc.
  Identificacion?: string;
  
  // Campos específicos de Proveedor Jurídico (Id_Tipo_Proveedor = 2)
  Cedula_Juridica?: string;
  Razon_Social?: string;
}

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
  Ultima_Fecha_Baja?: Date | string | null;
  Estado_Material: EstadoMaterial;
  Unidad_Medicion: UnidadMedicion;
  Proveedor?: Proveedor;
  Id_Tipo_Proveedor?: number;
  Id_Proveedor?: number;
  materialCategorias: {
    Id_Material_Categoria: number;
    Categoria: CategoriaMaterial;
  }[];
  Categorias?: {
    Id_Material_Categoria: number;
    Categoria: CategoriaMaterial;
  }[];
  Usuario_Creador?: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
  };
}

export interface CreateMaterialData {
  Nombre_Material: string;
  Descripcion?: string;
  Id_Unidad_Medicion: number;
  Cantidad: number;
  Precio_Unitario: number;
  IDS_Categorias?: number[];
  Id_Tipo_Proveedor?: number;
  Id_Proveedor?: number;
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