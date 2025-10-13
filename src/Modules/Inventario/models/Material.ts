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

// ============================================
// TIPOS PARA MEDIDORES (extensión de Material)
// ============================================

// Estados específicos de medidor
export interface EstadoMedidor {
  Id_Estado_Medidor: number;
  Nombre_Estado_Medidor: string; // "No Instalado", "Instalado", "Averiado"
}

// Afiliado relacionado al medidor (puede ser físico o jurídico)
export interface AfiliadoMedidor {
  Id_Afiliado: number;
  Nombre_Completo_Afiliado?: string; // Para afiliado físico
  Razon_Social?: string; // Para afiliado jurídico
  Id_Tipo_Afiliado: number; // 1 = Físico, 2 = Jurídico
  Nombre_Tipo_Afiliado?: string;
}

// Medidor (manejado como material especial en backend separado)
export interface Medidor {
  Id_Medidor: number;
  Numero_Medidor: number;
  Fecha_Creacion: Date | string;
  Fecha_Actualizacion: Date | string;
  Estado_Medidor: EstadoMedidor;
  Afiliado?: AfiliadoMedidor;
  Usuario_Creador?: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol?: string;
  };
}

// DTO para crear un medidor
export interface CreateMedidorData {
  Numero_Medidor: number;
}

// DTO para asignar medidor a afiliado
export interface AsignarMedidorData {
  Id_Medidor: number;
  Id_Tipo_Entidad: 1 | 2; // 1 = Física, 2 = Jurídica
  Id_Afiliado: number;
}