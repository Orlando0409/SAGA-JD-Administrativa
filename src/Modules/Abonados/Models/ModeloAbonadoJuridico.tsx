export interface AbonadoJuridico {
    Id_Abonado: number
    Razon_Social: string
    Cedula_Juridica: string
    Numero_Telefono: string
    Correo: string
    Direccion_Exacta?: string
   
    Estado: {
        Id_Estado_Afiliado: number
        Nombre_Estado: string
    }
    Fecha_Creacion: string
    Fecha_Actualizacion: string
    Escritura_Terreno?: string
    Planos_Terreno?: string
}

export const AbonadoInicialState: AbonadoJuridico = {
    Id_Abonado: 0,
    Razon_Social: '',
    Cedula_Juridica: '',
    Numero_Telefono: '',
    Correo: '',
    Direccion_Exacta: '',
    Estado: {
        Id_Estado_Afiliado: 1,
        Nombre_Estado: 'Activo'
    },
    Fecha_Creacion: new Date().toISOString(),
    Fecha_Actualizacion: new Date().toISOString(),
};