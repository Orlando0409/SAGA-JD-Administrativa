export interface SolicitudJuridicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado" | "Agregar Medidor";
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
    Certificacion_Literal: File | string;
}
export interface SolicitudDesconexionJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Certificacion_Literal: File | string;
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

export interface SolicitudAgregarMedidorJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Certificacion_Literal: File | string;
    Id_Nuevo_Medidor?: number | string;
}

export interface CreateSolicitudAgregarMedidorJuridicaDTO {
    Cedula_Juridica: string;
    Razon_Social: string;
    Correo: string;
    Numero_Telefono: string;
    Direccion_Exacta: string;
    Planos_Terreno: File;
    Certificacion_Literal: File;
    Id_Nuevo_Medidor?: number | string;
}

export type SolicitudJuridica =
    | SolicitudAfiliacionJuridica
    | SolicitudDesconexionJuridica
    | SolicitudCambioMedidorJuridica
    | SolicitudAsociadoJuridica
    | SolicitudAgregarMedidorJuridica;
