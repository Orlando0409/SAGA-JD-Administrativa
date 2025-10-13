export interface ProveedorFisico {
  Nombre_Proveedor: string; 
  Telefono_Proveedor: string; 
  Tipo_Identificacion: string;
  Identificacion: string; 
  Id_Estado_Proveedor: number; 
}

export const ProveedorFisicaInicialState: ProveedorFisico = {
  Nombre_Proveedor: "",
  Telefono_Proveedor: "",       
  Tipo_Identificacion: "",        
  Identificacion: "",
  Id_Estado_Proveedor: 0
};  
