export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface AfiliadoFisico {
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    Identificacion: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta?: string;
    Edad: number;
    Planos_Terreno?: File | string;
    Certificacion_Literal?: File | string;
    Tipo_Identificacion: TipoIdentificacion; 
}

export const AfiliadoFisicoInicialState: AfiliadoFisico = {
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    Identificacion: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Edad: 0,
    Planos_Terreno: undefined,
    Certificacion_Literal: undefined,
    Tipo_Identificacion: "Cedula Nacional"
}

export interface AfiliacionFisicaFormData {
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    Identificacion: string;
    Correo: string;
    Direccion_Exacta: string;
    Numero_Telefono: string;
    Edad: number;
    Planos_Terreno?: File | string;
    Certificacion_Literal?: File | string;
    Tipo_Identificacion: TipoIdentificacion; // ✅ Usar el tipo unificado
}