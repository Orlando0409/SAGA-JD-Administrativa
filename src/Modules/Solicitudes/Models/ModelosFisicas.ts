export interface SolicitudFisicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado" | "Agregar Medidor";
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
    Identificacion: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta?: string;
    Edad?: number;
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
    Planos_Terreno?: File | string;
    Escritura_Terreno?: File | string;
    // Mantener Cedula por compatibilidad pero priorizar Identificacion

}




export interface SolicitudAfiliacionFisica extends SolicitudFisicaBase {
    Direccion_Exacta: string;
    Edad: number;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}

export interface SolicitudDesconexionFisica extends SolicitudFisicaBase {
    Motivo_Solicitud: string;
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}

export interface SolicitudCambioMedidorFisica extends SolicitudFisicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor_Anterior: string;
    Numero_Medidor?: string | number;
}

export interface SolicitudAsociadoFisica extends SolicitudFisicaBase {
    Motivo_Solicitud: string;
}

export interface SolicitudAgregarMedidorFisica extends SolicitudFisicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor_Nuevo?: string | number;
}

export type SolicitudFisica =
    | SolicitudAfiliacionFisica
    | SolicitudDesconexionFisica
    | SolicitudCambioMedidorFisica
    | SolicitudAsociadoFisica
    | SolicitudAgregarMedidorFisica;