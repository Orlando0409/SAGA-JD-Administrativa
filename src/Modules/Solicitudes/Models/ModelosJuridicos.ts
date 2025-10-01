export interface SolicitudJuridicaBase {
    Id_Solicitud?: number; // ID del backend
    Tipo_Solicitud: "Afiliacion" | "Desconexion" | "Cambio de Medidor" | "Asociado";
    Razon_Social: string;
    Cedula_Juridica: string;
    Direccion_Exacta?: string;
    Numero_Telefono: string;
    Correo: string;
    Estado: {
        Id_Estado_Solicitud: number;
        Nombre_Estado: string;
    };
    Fecha_Creacion: string;
    Fecha_Actualizacion: string;
}


export interface SolicitudAfiliacionJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}
export interface SolicitudDesconexionJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;
    Direccion_Exacta: string;
    Planos_Terreno: File | string;
    Escritura_Terreno: File | string;
}
export interface SolicitudCambioMedidorJuridica extends SolicitudJuridicaBase {
    Direccion_Exacta: string;
    Motivo_Solicitud: string;
    Numero_Medidor_Anterior: string;
}
export interface SolicitudAsociadoJuridica extends SolicitudJuridicaBase {
    Motivo_Solicitud: string;
    
}
function getInitialSolicitudJuridica(tipo: SolicitudJuridicaBase['Tipo_Solicitud']) {
    switch (tipo) {
        case 'Afiliacion':
            return {        
                Tipo_Solicitud: 'Afiliacion',
                Cedula_Juridica: '',
                Razon_Social: '',
                Direccion_Exacta: '',
                Numero_Telefono: '',
                Correo: '',
                Estado: {
                    Id_Estado_Solicitud: 1,
                    Nombre_Estado: 'Pendiente'
                },
                Fecha_Creacion: new Date().toISOString(),
                Fecha_Actualizacion: new Date().toISOString(),
                Planos_Terreno: '',
                Escritura_Terreno: ''
            } as SolicitudAfiliacionJuridica;
        case 'Desconexion':
            return {
                Tipo_Solicitud: 'Desconexion',
                Cedula_Juridica: '',
                Razon_Social: '',
                Direccion_Exacta: '',
                Numero_Telefono: '',
                Correo: '',
                Estado: {
                    Id_Estado_Solicitud: 1,
                    Nombre_Estado: 'Pendiente'
                },
                Fecha_Creacion: new Date().toISOString(),
                Fecha_Actualizacion: new Date().toISOString(),
                Planos_Terreno: '',
                Escritura_Terreno: '',
                Motivo_Solicitud: ''
            } as SolicitudDesconexionJuridica;     
        case 'Cambio de Medidor':
            return {
                Tipo_Solicitud: 'Cambio de Medidor',
                Cedula_Juridica: '',
                Razon_Social: '',
                Direccion_Exacta: '',
                Numero_Telefono: '',
                Correo: '',
                Motivo_Solicitud: '',
                Estado: {
                    Id_Estado_Solicitud: 1,
                    Nombre_Estado: 'Pendiente'
                },
                Fecha_Creacion: new Date().toISOString(),
                Fecha_Actualizacion: new Date().toISOString(),
                 
            } as SolicitudCambioMedidorJuridica;
        case 'Asociado':
            return {
                Tipo_Solicitud: 'Asociado',
                Cedula_Juridica: '',
                Razon_Social: '',
                Direccion_Exacta: '',
                Numero_Telefono: '',
                Correo: '',
                Estado: {
                    Id_Estado_Solicitud: 1,
                    Nombre_Estado: 'Pendiente'
                },
                Fecha_Creacion: new Date().toISOString(),
                Fecha_Actualizacion: new Date().toISOString()
            } as SolicitudAsociadoJuridica;
        default:
            throw new Error('Tipo de solicitud no válido');
    }
}
export type SolicitudJuridica = 
    | SolicitudAfiliacionJuridica 
    | SolicitudDesconexionJuridica 
    | SolicitudCambioMedidorJuridica 
    | SolicitudAsociadoJuridica; 
   