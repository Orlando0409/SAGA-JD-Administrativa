export interface SolicitudJuridicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado" | "Medidor Extra";
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
    Id_Medidor?: number;
    Numero_Medidor?: string | number;
    Numero_Medidor_Actual?: string | number;
    Medidor?: {
        Id_Medidor?: number;
        Numero_Medidor?: string | number;
    };
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
    Numero_Medidor?: string | number;
}
export interface SolicitudAsociadoJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;

}

export interface SolicitudMedidorExtraJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor?: string | number;
}

export type SolicitudJuridica =
    | SolicitudAfiliacionJuridica
    | SolicitudDesconexionJuridica
    | SolicitudCambioMedidorJuridica
    | SolicitudAsociadoJuridica
    | SolicitudMedidorExtraJuridica;
