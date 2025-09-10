
export interface Abonado {
    id: number
    nombre: string
    apellido1: string
    apellido2?: string
    cedula: string
    telefono: string
    direccion?: string
    estado: 'Pendiente' | 'Aprobado' | 'Rechazado'
    fechaCreacion: string
}


export const AbonadoInicialState: Abonado = {
    id: 0,
    nombre: '',
    apellido1: '',
    apellido2: '',
    cedula: '',
    telefono: '',
    direccion: '',
    estado: 'Pendiente',
    fechaCreacion: new Date().toISOString(),
};