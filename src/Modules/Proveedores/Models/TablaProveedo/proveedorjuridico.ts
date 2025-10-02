export interface ProveedorJuridico {
  Id_Proveedor: number; // ID del proveedor
  Nombre_Proveedor: string; // Nombre del proveedor
  Telefono_Proveedor: string; // Teléfono del proveedor
  Estado_Proveedor:{
    Id_Estado_Proveedor: number; // ID del estado del proveedor
    Estado_Proveedor: string;
  } 
  Fecha_Creacion: string; // Fecha de creación del registro
  Fecha_Actualizacion: string; // Fecha de actualización del registro
  Tipo_identificacion: string;
  Cedula_Juridica: string; // Campo corregido para coincidir con el backend
  Razon_Social : string;
}

// Tipo específico para crear proveedores jurídicos
export interface CreateProveedorJuridicoData {
  Nombre_Proveedor: string;
  Telefono_Proveedor: string;
  Cedula_Juridica: string; // Campo corregido
  Tipo_identificacion: string;
  Razon_Social: string;
  Id_Estado_Proveedor: number;
}

// Tipo específico para actualizar proveedores jurídicos
export interface UpdateProveedorJuridicoData {
  Nombre_Proveedor: string;
  Telefono_Proveedor: string;
  Razon_Social: string;
}

export const ProveedorJuridicoInicialState: ProveedorJuridico = {
  Id_Proveedor: 0,
  Nombre_Proveedor: "",
  Telefono_Proveedor: "",
  Estado_Proveedor: {
    Id_Estado_Proveedor: 0,
    Estado_Proveedor: ""
  },
  Fecha_Creacion: "",
  Fecha_Actualizacion: "",
  Tipo_identificacion: "",
  Cedula_Juridica: "", // Campo corregido
  Razon_Social: ""
};
