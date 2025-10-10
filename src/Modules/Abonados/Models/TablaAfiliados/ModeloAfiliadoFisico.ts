export type TipoIdentificacion = "Cedula" | "Pasaporte" | "DIMEX" | "Otro";

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
    Escritura_Terreno?: string
    Planos_Terreno?: string
     Tipo_Identificacion: TipoIdentificacion;
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