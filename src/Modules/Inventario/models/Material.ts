import type { CategoriaMaterial, EstadoCategoria } from "./CategoriaMaterial";
import type { EstadoUnidadMedicion } from "./UnidadMedicion";


type NullableDate = Date | string | null;

// Tipo para representar un proveedor (físico o jurídico) según estructura del backend
export interface Proveedor {
  Id_Proveedor: number;
  Tipo_Entidad: number; // 1 = Físico, 2 = Jurídico 
  Nombre_Proveedor: string; // Presente en ambos tipos
  Telefono_Proveedor: string;
  
  // Campos específicos de Proveedor Físico (Tipo_Entidad = 1)
  Tipo_Identificacion?: string; 
  Identificacion?: string;
  
  // Campos específicos de Proveedor Jurídico (Tipo_Entidad = 2)
  Cedula_Juridica?: string;
  Razon_Social?: string;
  
  // Estado del proveedor
  Estado?: {
    Id_Estado_Proveedor: number;
    Nombre_Estado_Proveedor: string;
  };
}

export interface Material {
  Id_Material: number;
  Nombre_Material: string;
  Descripcion: string;
  Cantidad: number;
  Precio_Unitario: number;
  Ultima_Fecha_Baja?: NullableDate;
  Estado_Material: EstadoMaterial;
  Unidad_Medicion: {
    Id_Unidad_Medicion: number;
    Nombre_Unidad_Medicion?: string;
    Abreviatura?: string;
    Estado: EstadoUnidadMedicion;
  }
  Proveedor?: Proveedor;
  // El backend devuelve "Categorias" directamente como array
  Categorias?: CategoriaMaterial[];
  Usuario_Creador?: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol: string;
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
}

export interface CategoriaMateria 
  {
    Id_Categoria: number;
    Nombre_Categoria?: string;
    Estado: EstadoCategoria;
  }
