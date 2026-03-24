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
  Certificacion_Literal?: string | null;
  Planos_Terreno?: string | null;
  Afiliado?: {
    Id_Afiliado: number;
    Tipo_Entidad: number;
    Correo: string;
    Numero: string;
    // Campos para persona física (Tipo_Entidad = 1)
    Tipo_Identificacion?: string;
    Identificacion?: string;
    Nombre?: string;
    Primer_Apellido?: string;
    Segundo_Apellido?: string;
    // Campos para persona jurídica (Tipo_Entidad = 2)
    Cedula_Juridica: string;
    Razon_Social?: string;
    // Campos legacy (por compatibilidad)
    Numero_Afiliado?: string;
    Nombre_Completo?: string;
    Tipo_Afiliado?: string;
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
