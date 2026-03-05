export type TipoSolicitud =
    | 'afiliacion'
    | 'asociado'
    | 'cambio-medidor'
    | 'desconexion'
    | 'agregar-medidor';

export type TipoPersona = 'fisica' | 'juridica';


export const EstadoSolicitud = {
    Registro: 1,
    EnRevision: 2,
    AprobadaEnEspera: 3,
    Completada: 4,
    Rechazada: 5
} as const;

export type EstadoSolicitud = typeof EstadoSolicitud[keyof typeof EstadoSolicitud];


export interface CambioEstadoRequest {
    tipoSolicitud: TipoSolicitud;
    tipoPersona: TipoPersona;
    solicitudId: number | string;
    nuevoEstado: EstadoSolicitud;
    motivoRechazo?: string;
}
