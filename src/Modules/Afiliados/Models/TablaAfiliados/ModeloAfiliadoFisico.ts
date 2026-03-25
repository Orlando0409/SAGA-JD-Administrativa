export type TipoIdentificacion = "Cedula" | "Pasaporte" | "DIMEX" | "Otro";

export interface Medidor {
    Id_Medidor: number;
    Numero_Medidor: number;
    Id_Solicitud?: number;
    Fecha_Creacion?: string;
    Fecha_Actualizacion?: string;
    Estado_Medidor?: {
        Id_Estado_Medidor: number;
        Nombre_Estado_Medidor: string;
    };
    Certificacion_Literal?: string | null;
    Planos_Terreno?: string | null;
    Escrituras_Terreno?: string | null;
}

export interface AfiliadoFisico {
    Id_Afiliado: number
    Nombre: string
    Apellido1: string
    Apellido2?: string
    Numero_Telefono: string
    Identificacion: string;
    Correo: string
    Direccion_Exacta?: string
    Edad: number
    Estado: {
        Id_Estado_Afiliado: number
        Nombre_Estado: string
    }
    Tipo_Afiliado: {
        Id_Tipo_Afiliado: number
        Nombre_Tipo_Afiliado: string
    }
    Fecha_Creacion: string
    Fecha_Actualizacion: string
    Certificacion_Literal?: string
    Planos_Terreno?: string
    Escrituras_Terreno?: string
    Tipo_Identificacion: TipoIdentificacion;
    medidores?: Medidor[];
    Medidores?: Medidor[]; // Backend puede enviar con mayúscula
}

export const AfiliadoFisicoInicialState: AfiliadoFisico = {
    Id_Afiliado: 0,
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    Identificacion: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Edad: 0,
    Estado: {
        Id_Estado_Afiliado: 1,
        Nombre_Estado: 'activo'
    },
    Tipo_Afiliado: {
        Id_Tipo_Afiliado: 1,
        Nombre_Tipo_Afiliado: 'Abonado'
    },
    Fecha_Creacion: new Date().toISOString(),
    Fecha_Actualizacion: new Date().toISOString(),
    Tipo_Identificacion: 'Cedula'
}