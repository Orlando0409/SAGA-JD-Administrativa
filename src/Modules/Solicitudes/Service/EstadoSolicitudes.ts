import apiAuth from "@/Api/apiAuth";
import type {
    CambioEstadoRequest,
    TipoSolicitud,
    TipoPersona,
    EstadoSolicitud
} from "../Types/EstadoSolicitudes";


export class ServiceEstadoSolicitudes {


    private static construirEndpoint(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string,
        nuevoEstado: number
    ): string {
        // Mapa de endpoints por tipo de solicitud y persona
        const endpointMap: Record<TipoSolicitud, Record<TipoPersona, string>> = {
            'afiliacion': {
                'fisica': '/solicitudes-fisicas/update/estado/afiliacion',
                'juridica': '/solicitudes-juridicas/update/estado/afiliacion'
            },
            'asociado': {
                'fisica': '/solicitudes-fisicas/update/estado/asociado',
                'juridica': '/solicitudes-juridicas/update/estado/asociado'
            },
            'cambio-medidor': {
                'fisica': '/solicitudes-fisicas/update/estado/cambio-medidor',
                'juridica': '/solicitudes-juridicas/update/estado/cambio-medidor'
            },
            'desconexion': {
                'fisica': '/solicitudes-fisicas/update/estado/desconexion',
                'juridica': '/solicitudes-juridicas/update/estado/desconexion'
            },
            'agregar-medidor': {
                'fisica': '/solicitudes-fisicas/update/estado/agregar-medidor',
                'juridica': '/solicitudes-juridicas/update/estado/agregar-medidor'
            }
        };
        const baseEndpoint = endpointMap[tipoSolicitud][tipoPersona];
        return `${baseEndpoint}/${solicitudId}/${nuevoEstado}`;
    }


    static async cambiarEstado(request: CambioEstadoRequest): Promise<void> {
        
        const { tipoSolicitud, tipoPersona, solicitudId, nuevoEstado, motivoRechazo, ocupaPagarMedidor, estadoPago } = request;

        const url = this.construirEndpoint(tipoSolicitud, tipoPersona, solicitudId, nuevoEstado);
        let body: Record<string, any> = {};
        try {
 
            // Enviar datos adicionales solo para ciertos estados
            if (nuevoEstado === 3 && ocupaPagarMedidor) {
                body = {
                    ocupaPago: Boolean(ocupaPagarMedidor.ocupaPago)
                };

                if (body.ocupaPago) {
                    if (typeof ocupaPagarMedidor.montoCambio === 'number') {
                        body.montoCambio = ocupaPagarMedidor.montoCambio;
                    }
                    if (ocupaPagarMedidor.motivoCobro) {
                        body.motivoCobro = ocupaPagarMedidor.motivoCobro;
                    }
                }
            }

            // Enviar motivoRechazo solo cuando es un rechazo (estado 5)
            if (nuevoEstado === 5 && motivoRechazo) {
                body = { motivoRechazo };
            }

            // Para completar solicitudes de cambio/agregar medidor, incluir estado de pago seleccionado
            if (
                nuevoEstado === 4 &&
                (tipoSolicitud === 'agregar-medidor' || tipoSolicitud === 'cambio-medidor') &&
                estadoPago
            ) {
                body = { Estado_Pago: estadoPago };
            }

            await apiAuth.patch(url, body);
        } catch (error) {
            console.error(`Error al cambiar estado:`, error);
            throw error;
        }
    }


    static async marcarEnRevision(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string
    ): Promise<void> {
        return this.cambiarEstado({
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado: 2 // EstadoSolicitud.EnRevision
        });
    }

    static async aprobarYEnEspera(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string
    ): Promise<void> {
        return this.cambiarEstado({
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado: 3 // EstadoSolicitud.AprobadaEnEspera
        });
    }


    static async completar(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string
    ): Promise<void> {
        return this.cambiarEstado({
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado: 4 // EstadoSolicitud.Completada
        });
    }


    static async rechazar(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string,
        motivoRechazo?: string
    ): Promise<void> {
        return this.cambiarEstado({
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado: 5, // EstadoSolicitud.Rechazada
            motivoRechazo // Pasar motivo de rechazo si se proporciona
        });
    }


    static obtenerNombreEstado(estado: EstadoSolicitud): string {
        const nombres: Record<EstadoSolicitud, string> = {
            1: 'Registro',
            2: 'En Revisión',
            3: 'Aprobada y en Espera',
            4: 'Completada',
            5: 'Rechazada'
        };
        return nombres[estado];
    }


    static esTransicionValida(estadoActual: EstadoSolicitud, estadoNuevo: EstadoSolicitud): boolean {
        // Siempre se puede rechazar desde cualquier estado
        if (estadoNuevo === 5) return true;

        // Las transiciones válidas normales son secuenciales
        const transicionesValidas: Record<EstadoSolicitud, EstadoSolicitud[]> = {
            1: [2], // Registro → En Revisión
            2: [3], // En Revisión → Aprobada y en Espera
            3: [4], // Aprobada y en Espera → Completada
            4: [],  // Completada no puede cambiar a ningún otro estado
            5: []   // Rechazada no puede cambiar a ningún otro estado
        };

        return transicionesValidas[estadoActual]?.includes(estadoNuevo) || false;
    }
}


export const mapearTipoSolicitud = (tipoBackend: string): TipoSolicitud => {
    const mapeo: Record<string, TipoSolicitud> = {
        'Afiliacion': 'afiliacion',
        'Asociado': 'asociado',
        'Cambio de Medidor': 'cambio-medidor',
        'Desconexion': 'desconexion',
        'Agregar Medidor': 'agregar-medidor'
    };

    return mapeo[tipoBackend] || 'afiliacion';
};


export const mapearTipoPersona = (tipoBackend: string): TipoPersona => {
    // Acepta tanto 'Física'/'Físico' como 'Jurídica'/'Jurídico'
    return (tipoBackend === 'Física' || tipoBackend === 'Físico') ? 'fisica' : 'juridica';
};
