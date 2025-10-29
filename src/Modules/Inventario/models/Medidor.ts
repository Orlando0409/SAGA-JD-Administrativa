export interface EstadoMedidor {
  Id_Estado_Medidor: number;
  Nombre_Estado_Medidor: string;
}

export interface Medidor {
  Id_Medidor: number;
  Numero_Medidor: number;
  Fecha_Creacion: string | Date;
  Fecha_Actualizacion: string | Date;
  Estado_Medidor: EstadoMedidor;
  Afiliado?: {
    Id_Afiliado: number;
    Numero_Afiliado: string;
    Nombre_Completo?: string;
    Razon_Social?: string;
    Tipo_Afiliado: string;
  } | null;
  Usuario: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol: string;
  };
}

export interface CreateMedidorData {
  Numero_Medidor: number;
}
