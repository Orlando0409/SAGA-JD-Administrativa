export interface SolicitudFisicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado";
    Nombre: string;
    Apellido1: string;
    Apellido2?: string;
    Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
    Identificacion: string;
    Numero_Telefono: string;
    Correo: string;
    Direccion_Exacta?: string;
    Edad?: number;
    Estado: {
        Id_Estado_Solicitud: number;
        Nombre_Estado: string;
    };
    Fecha_Creacion: string;
    Fecha_Actualizacion: string;
    Planos_Terreno?: File | string;
    Escritura_Terreno?: File | string;
    // Mantener Cedula por compatibilidad pero priorizar Identificacion
   
}




export interface SolicitudAfiliacionFisica extends SolicitudFisicaBase {
    Direccion_Exacta: string;
    Edad: number;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}

export interface SolicitudDesconexionFisica extends SolicitudFisicaBase {
    Motivo_Solicitud: string;
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}

export interface SolicitudCambioMedidorFisica extends SolicitudFisicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor_Anterior: string;
}

export interface SolicitudAsociadoFisica extends SolicitudFisicaBase {
    Motivo_Solicitud: string;
}

function getInitialSolicitudFisica(tipo: SolicitudFisicaBase['Tipo_Solicitud']) {
    switch (tipo) {
        case 'Afiliacion':
            return {
                Tipo_Solicitud: 'Afiliacion',
                Cedula: '',
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Numero_Telefono: '',
                Correo: '',
                Direccion_Exacta: '',
                Edad: 0,
                Estado: {
                    Id_Estado_Solicitud: 1,
                    Nombre_Estado: 'Pendiente'
                },
                Fecha_Creacion: new Date().toISOString(),
                Fecha_Actualizacion: new Date().toISOString(),
                Planos_Terreno: '',
                Escritura_Terreno: '',
                // --- AGREGADO ---
                Tipo_Identificacion: 'Cedula Nacional',
                Identificacion: '',
            } as SolicitudAfiliacionFisica;
        case 'Desconexion':
            return {
                Tipo_Solicitud: 'Desconexion',
               
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Numero_Telefono: '',
                Correo: '',
                Direccion_Exacta: '',
                Motivo_Solicitud: '',
                Planos_Terreno: '',
                Escritura_Terreno: '',
                // --- AGREGADO ---
                Tipo_Identificacion: 'Cedula Nacional',
                Identificacion: '',
            } as SolicitudDesconexionFisica;
        case 'Cambio de Medidor':
            return {
                Tipo_Solicitud: 'Cambio de Medidor',
               
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Numero_Telefono: '',
                Correo: '',
                Numero_Medidor_Anterior: '',
                Direccion_Exacta: '',
                Motivo_Solicitud: '',
                // --- AGREGADO ---
                Tipo_Identificacion: 'Cedula Nacional',
                Identificacion: '',
            } as SolicitudCambioMedidorFisica;
        case 'Asociado':
            return {
                Tipo_Solicitud: 'Asociado',
               
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Numero_Telefono: '',
                Correo: '',
                Motivo_Solicitud: '',
                // --- AGREGADO ---
                Tipo_Identificacion: 'Cedula Nacional',
                Identificacion: '',
            } as SolicitudAsociadoFisica;
        default:
            throw new Error('Tipo de solicitud no válido');
    }
}

export type SolicitudFisica =
    | SolicitudAfiliacionFisica
    | SolicitudDesconexionFisica
    | SolicitudCambioMedidorFisica
    | SolicitudAsociadoFisica;