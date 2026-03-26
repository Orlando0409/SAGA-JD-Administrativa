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
    Estado_Pago?:
        | string
        | {
            Id_Estado_Pago?: number;
            Nombre_Estado_Pago: string;
        }
        | null;
    Certificacion_Literal?: string | null;
    Planos_Terreno?: string | null;
    Escrituras_Terreno?: string | null;
}

export interface AfiliadoJuridico {
    Id_Afiliado: number
    Razon_Social: string
    Cedula_Juridica: string
    Numero_Telefono: string




    Correo: string
    Direccion_Exacta?: string
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
    medidores?: Medidor[];
    Medidores?: Medidor[]; // Backend puede enviar con mayúscula
}

export const AfiliadoJuridicoInicialState: AfiliadoJuridico = {
    Id_Afiliado: 0,
    Razon_Social: '',
    Cedula_Juridica: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
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
}