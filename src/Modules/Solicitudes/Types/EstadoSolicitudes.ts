/**
 * Tipos compartidos para el manejo de solicitudes
 */

export type TipoSolicitud =
    | 'afiliacion'
    | 'asociado'
    | 'cambio-medidor'
    | 'desconexion';

export type TipoPersona = 'fisica' | 'juridica';

/**
 * Estados de solicitud
 */
export const EstadoSolicitud = {
    Registro: 1,
    EnRevision: 2,
    AprobadaEnEspera: 3,
    Completada: 4,
    Rechazada: 5
} as const;

export type EstadoSolicitud = typeof EstadoSolicitud[keyof typeof EstadoSolicitud];

/**
 * Request para cambiar el estado de una solicitud
 */
export interface CambioEstadoRequest {
    tipoSolicitud: TipoSolicitud;
    tipoPersona: TipoPersona;
    solicitudId: number | string;
    nuevoEstado: EstadoSolicitud;
    motivoRechazo?: string;
}
