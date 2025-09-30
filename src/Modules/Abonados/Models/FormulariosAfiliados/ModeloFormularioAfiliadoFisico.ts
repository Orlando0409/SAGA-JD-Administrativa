export type TipoIdentificacion = "Cedula" | "Pasaporte" | "DIMEX" | "Otro";

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
    Escritura_Terreno?: File | string;
   Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte'; // <-- Nuevo campo
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
    Escritura_Terreno: undefined,
    Tipo_Identificacion: "Cedula Nacional" // Valor inicial por defecto
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
    Escritura_Terreno?: File | string;
    Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte'; // <-- Nuevo campo
}