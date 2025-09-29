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
  Tipo_identificacion: string;
  identificacion: string; 
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
  Tipo_identificacion: "",
  identificacion: ""
};
