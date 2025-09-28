export interface ProveedorFisico {
  Nombre_Proveedor: string; 
  Telefono_Proveedor: string; 
  Tipo_identificacion: string;
  identificacion: string; 
  Id_Estado_Proveedor: number; 
}

export const ProveedorFisicaInicialState: ProveedorFisico = {
  Nombre_Proveedor: "",
  Telefono_Proveedor: "",       
  Tipo_identificacion: "",        
  identificacion: "",
  Id_Estado_Proveedor: 0
};  
