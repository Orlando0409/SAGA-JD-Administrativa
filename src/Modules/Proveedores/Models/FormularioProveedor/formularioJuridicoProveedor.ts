export interface ProveedorJuridico {
  Nombre_Proveedor: string; 
  Telefono_Proveedor: string; 
  Tipo_identificacion: string;
  Cedula_Juridica: string; 
  Razon_Social : string;
  Id_Estado_Proveedor: number; 
}   

export const ProveedorJuridicoInicialState: ProveedorJuridico = {   
    Nombre_Proveedor: "",   
    Telefono_Proveedor: "", 
    Tipo_identificacion: "",
    Cedula_Juridica: "", 
    Razon_Social : "",
    Id_Estado_Proveedor: 0
};
