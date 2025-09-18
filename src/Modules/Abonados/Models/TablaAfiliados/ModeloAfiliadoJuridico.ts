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
    Escritura_Terreno?: string
    Planos_Terreno?: string
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