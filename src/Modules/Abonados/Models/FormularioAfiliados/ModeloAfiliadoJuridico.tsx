export interface AfiliadoJuridico {

    Razon_Social: string
    Cedula_Juridica: string
    Numero_Telefono: string
    Correo: string
    Direccion_Exacta?: string
    Planos_Terreno?: File | string;
    Escritura_Terreno?: File | string;
}

export const AfiliadoJuridicoInicialState: AfiliadoJuridico = {

    Razon_Social: '',
    Cedula_Juridica: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Planos_Terreno: undefined,
    Escritura_Terreno: undefined,
}
export interface AfiliadoJuridicoFormData {
    Razon_Social: string;
    Cedula_Juridica: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta: string;
    Planos_Terreno?: File | string;
    Escritura_Terreno?: File | string;
}