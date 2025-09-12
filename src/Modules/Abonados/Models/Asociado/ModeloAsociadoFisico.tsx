export interface AsociadoFisico {
    Id_Asociado?: number
    Nombre: string
    Apellido1: string
    Apellido2?: string
    Cedula: string
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

export const AsociadoFisicoInicialState: AsociadoFisico = {
    Nombre: '',
    Apellido1: '',
    Apellido2: '',
    Cedula: '',
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