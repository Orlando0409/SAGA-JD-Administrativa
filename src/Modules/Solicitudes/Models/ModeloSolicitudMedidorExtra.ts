import type { SolicitudFisica } from './ModelosFisicas';
import type { SolicitudJuridica } from './ModelosJuridicos';

export interface CreateSolicitudMedidorExtraFisicaDto {
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
    Identificacion: string;
    Numero_Telefono: string;
    Correo: string;
    Edad: number;
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
}

export interface CreateSolicitudMedidorExtraJuridicaDto {
    Razon_Social: string;
    Cedula_Juridica: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Representante_Legal?: string;
    Cedula_Representante?: string;
}

export interface SolicitudMedidorExtraResponse {
    Id_Solicitud: number;
    Id_Tipo_Solicitud: number;
    Id_Medidor?: number | null;
    Numero_Medidor?: string | number | null;
    Estado?: {
        Id_Estado_Solicitud: number;
        Nombre_Estado: string;
    };
    [key: string]: unknown;
}

export type SolicitudMedidorExtraItem = SolicitudFisica | SolicitudJuridica;
