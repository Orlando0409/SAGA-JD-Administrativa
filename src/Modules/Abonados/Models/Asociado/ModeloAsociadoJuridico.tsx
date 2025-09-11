export interface AsociadoJuridico {
    Id_Asociado?: number
    Razon_Social: string
    Cedula_Juridica: string
    Numero_Telefono: string
    Correo: string
    Motivo_Solicitud: string
    Estado?: {
        Id_Estado_Solicitud: number
        Nombre_Estado: string
    }
    Fecha_Creacion?: string
    Fecha_Actualizacion?: string
}

export const AsociadoJuridicoInicialState: AsociadoJuridico = {
    Razon_Social: '',
    Cedula_Juridica: '',
    Numero_Telefono: '',
    Correo: '',
    Motivo_Solicitud: '',
    Estado: {
        Id_Estado_Solicitud: 1,
        Nombre_Estado: 'Pendiente'
    },
    Fecha_Creacion: new Date().toISOString(),
    Fecha_Actualizacion: new Date().toISOString(),
};