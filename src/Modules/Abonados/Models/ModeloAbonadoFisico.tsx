
export interface Abonado {
    Id_Abonado: number
    Nombre: string
    Apellido1: string
    Apellido2?: string
    Cedula: string
    Numero_Telefono: string
    Correo: string
    Direccion_Exacta?: string
    Edad: number
    Estado: {
        Id_Estado_Afiliado: number
        Nombre_Estado: string
    }
    Fecha_Creacion: string
    Fecha_Actualizacion: string
    Escritura_Terreno?: string
    Planos_Terreno?: string
}

export const AbonadoInicialState: Abonado = {
    Id_Abonado: 0,
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    Cedula: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Edad: 0,
    Estado: {
        Id_Estado_Afiliado: 1,
        Nombre_Estado: 'Activo'
    },
    Fecha_Creacion: new Date().toISOString(),
    Fecha_Actualizacion: new Date().toISOString(),
};