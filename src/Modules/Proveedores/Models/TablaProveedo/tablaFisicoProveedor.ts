export interface ProveedorFisico {
  Id_Proveedor: number; // ID del proveedor
  Nombre_Proveedor: string; // Nombre del proveedor
  Telefono_Proveedor: string; // Teléfono del proveedor
  Estado_Proveedor:{
    Id_Estado_Proveedor: number; // ID del estado del proveedor
    Estado_Proveedor: string;
  } 
  Fecha_Creacion: string; // Fecha de creación del registro
  Fecha_Actualizacion: string; // Fecha de actualización del registro
  Tipo_Identificacion: string;
  Identificacion : string; 
}

// Tipo específico para crear/actualizar proveedores (simplificado, similar a CreateUserData)
export interface CreateProveedorData {
  Nombre_Proveedor: string;
  Telefono_Proveedor: string;
  Identificacion: string;
  Tipo_Identificacion: string;
  Id_Estado_Proveedor: number;
}

// Tipo específico para actualizar proveedores (solo campos editables)
export interface UpdateProveedorData {
  Nombre_Proveedor: string;
  Telefono_Proveedor: string;
}

export const ProveedorFisicoInicialState: ProveedorFisico = {
  Id_Proveedor: 0,
  Nombre_Proveedor: "",
  Telefono_Proveedor: "",
  Estado_Proveedor: {
    Id_Estado_Proveedor: 0,
    Estado_Proveedor: ""
  },
  Fecha_Creacion: "",
  Fecha_Actualizacion: "",
  Tipo_Identificacion: "",
  Identificacion: ""
};
