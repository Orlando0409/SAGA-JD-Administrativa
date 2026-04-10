export interface AfiliadoJuridico {
    Razon_Social: string
    Cedula_Juridica: string
    Numero_Telefono: string
    Correo: string
    Direccion_Exacta?: string
    Planos_Terreno?: File | string;
    Certificacion_Literal?: File | string;
}

export const AfiliadoJuridicoInicialState: AfiliadoJuridico = {
    Razon_Social: '',
    Cedula_Juridica: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Planos_Terreno: undefined,
    Certificacion_Literal: undefined,
}

export interface AfiliadoJuridicoFormData {
    Razon_Social: string;
    Cedula_Juridica: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta: string;
    Planos_Terreno?: File | string;
    Certificacion_Literal?: File | string;
}