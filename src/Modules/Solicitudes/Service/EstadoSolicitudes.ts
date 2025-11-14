import apiAuth from "@/Api/apiAuth";
import type {
    CambioEstadoRequest,
    TipoSolicitud,
    TipoPersona,
    EstadoSolicitud
} from "../Types/EstadoSolicitudes";

/**
 * 🎯 Servicio Unificado para manejo de estados de solicitudes
 * 
 * Este servicio centraliza toda la lógica de cambio de estados para:
 * - Afiliación (física y jurídica)
 * - Asociado (físico y jurídico)
 * - Cambio de Medidor (físico y jurídico)
 * - Desconexión (físico y jurídico)
 * 
 * Reemplaza a los 16+ servicios individuales anteriores
 */
export class ServiceEstadoSolicitudes {

    /**
     * 🔗 Construye la URL del endpoint según el tipo de solicitud y persona
     * 
     * Mapea las combinaciones de tipo de solicitud y persona a sus endpoints correspondientes
     * 
     * Endpoints del backend:
     * - Físicas: /solicitudes-fisicas/update/estado/{tipo}/:idSolicitud/:idNuevoEstado
     * - Jurídicas: /solicitudes-juridicas/update/estado/{tipo}/:idSolicitud/:idNuevoEstado
     */
    private static construirEndpoint(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona
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
            }
        };

        return endpointMap[tipoSolicitud][tipoPersona];
    }

    /**
     * 🔄 Método genérico para cambiar el estado de cualquier solicitud
     * 
     * @param request - Objeto con toda la información necesaria para el cambio de estado
     * @returns Promise<void>
     * 
     * @example
     * await ServiceEstadoSolicitudes.cambiarEstado({
     *   tipoSolicitud: 'afiliacion',
     *   tipoPersona: 'fisica',
     *   solicitudId: 123,
     *   nuevoEstado: EstadoSolicitud.EnRevision
     * });
     */
    static async cambiarEstado(request: CambioEstadoRequest): Promise<void> {
        const { tipoSolicitud, tipoPersona, solicitudId, nuevoEstado } = request;

        const baseEndpoint = this.construirEndpoint(tipoSolicitud, tipoPersona);
        const url = `${baseEndpoint}/${solicitudId}/${nuevoEstado}`;

        const emoji = tipoPersona === 'fisica' ? '👤' : '🏢';
        console.log(
            `🔄 ${emoji} Cambiando estado de solicitud ${tipoSolicitud} (${tipoPersona}) #${solicitudId} → Estado ${nuevoEstado}`
        );
        console.log(`📡 URL completa: PATCH ${url}`);
        console.log(`📋 Datos de la solicitud:`, {
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado,
            baseEndpoint
        });

        try {
            await apiAuth.patch(url);
            console.log(`✅ Estado actualizado correctamente`);
        } catch (error) {
            console.error(`❌ Error al cambiar estado:`, error);
            throw error;
        }
    }

    // ============================================
    // 🎁 Métodos de conveniencia para estados específicos
    // ============================================

    /**
     * 📋 Marca una solicitud como "En Revisión" (Estado 1 → 2)
     * Se ejecuta automáticamente al abrir el modal de una solicitud en estado Registro
     */
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

    /**
     * ✅ Aprueba y pone en espera (Estado 2 → 3)
     * Primer nivel de aprobación, la solicitud queda lista para asignar medidor
     */
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

    /**
     * 🎉 Completa la solicitud (Estado 3 → 4)
     * Se ejecuta después de asignar un medidor exitosamente
     */
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

    /**
     * ❌ Rechaza la solicitud (Cualquier estado → 5)
     * Puede ejecutarse desde cualquier estado
     */
    static async rechazar(
        tipoSolicitud: TipoSolicitud,
        tipoPersona: TipoPersona,
        solicitudId: number | string
    ): Promise<void> {
        return this.cambiarEstado({
            tipoSolicitud,
            tipoPersona,
            solicitudId,
            nuevoEstado: 5 // EstadoSolicitud.Rechazada
        });
    }

    // ============================================
    // 📊 Métodos de utilidad
    // ============================================

    /**
     * Obtiene el nombre legible de un estado
     */
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

    /**
     * Verifica si un cambio de estado es válido
     */
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

/**
 * 🔄 Mapeo de tipos de solicitud desde el backend
 * Utilidad para convertir los valores del backend a nuestros tipos internos
 */
export const mapearTipoSolicitud = (tipoBackend: string): TipoSolicitud => {
    const mapeo: Record<string, TipoSolicitud> = {
        'Afiliacion': 'afiliacion',
        'Asociado': 'asociado',
        'Cambio de Medidor': 'cambio-medidor',
        'Desconexion': 'desconexion'
    };

    return mapeo[tipoBackend] || 'afiliacion';
};

/**
 * 🔄 Mapeo de tipo de persona desde el backend
 */
export const mapearTipoPersona = (tipoBackend: string): TipoPersona => {
    // Acepta tanto 'Física'/'Físico' como 'Jurídica'/'Jurídico'
    return (tipoBackend === 'Física' || tipoBackend === 'Físico') ? 'fisica' : 'juridica';
};
