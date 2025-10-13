export interface SolicitudJuridicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado";
    Razon_Social: string;
    Cedula_Juridica: string;
    Direccion_Exacta?: string;
    Numero_Telefono: string;
    Correo: string;
    Estado: {
        Id_Estado_Solicitud: number;
        Nombre_Estado: string;
    };
    Fecha_Creacion: string;
    Fecha_Actualizacion: string;
}





export interface SolicitudAfiliacionJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}
export interface SolicitudDesconexionJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}
export interface SolicitudCambioMedidorJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor_Anterior: string;
}
export interface SolicitudAsociadoJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;
    
}

export type SolicitudJuridica = 
    | SolicitudAfiliacionJuridica 
    | SolicitudDesconexionJuridica 
    | SolicitudCambioMedidorJuridica 
    | SolicitudAsociadoJuridica; 
   