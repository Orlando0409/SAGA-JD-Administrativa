import apiAuth from "@/Api/apiAuth";
import type { SolicitudJuridica } from "../../Models/ModelosJuridicos";

/**
 * 🔄 Servicio para gestionar estados de solicitudes de afiliación jurídicas
 * Utiliza el endpoint /:id/update/estado/:nuevoEstadoId
 */
export class ServiceSolicitudAfiliacionJuridicas {
    
    /**
     * 🔄 PUT - Actualizar estado de una solicitud de afiliación jurídica
     * @param solicitudId ID de la solicitud a actualizar
     * @param nuevoEstadoId ID del nuevo estado
     * @returns Promise<SolicitudJuridica> Solicitud actualizada
     */
    static async updateEstado(solicitudId: string | number, nuevoEstadoId: string | number): Promise<SolicitudJuridica> {
        try {
            console.log(`🔄 Actualizando estado de solicitud jurídica ${solicitudId} a estado ${nuevoEstadoId}...`);
            
            const response = await apiAuth.patch<SolicitudJuridica>(
                `/solicitud-afiliacion-juridica/${solicitudId}/update/estado/${nuevoEstadoId}`
            );
            
            console.log('✅ Estado de solicitud jurídica actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar estado de solicitud jurídica:', error);
            throw error;
        }
    }

    /**
     * ✅ Aprobar solicitud de afiliación jurídica (cambiar a estado "Aprobada")
     * @param solicitudId ID de la solicitud
     * @param estadoAprobadoId ID del estado "Aprobada" (por defecto 3)
     * @returns Promise<SolicitudJuridica> Solicitud aprobada
     */
    static async aprobar(solicitudId: string | number, estadoAprobadoId: number = 3): Promise<SolicitudJuridica> {
        try {
            console.log(`✅ Aprobando solicitud de afiliación jurídica ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error('❌ Error al aprobar solicitud jurídica:', error);
            throw new Error('No se pudo aprobar la solicitud jurídica');
        }
    }

    /**
     * ❌ Rechazar solicitud de afiliación jurídica (cambiar a estado "Rechazada")
     * @param solicitudId ID de la solicitud
     * @param estadoRechazadoId ID del estado "Rechazada" (por defecto 4)
     * @returns Promise<SolicitudJuridica> Solicitud rechazada
     */
    static async rechazar(solicitudId: string | number, estadoRechazadoId: number = 4): Promise<SolicitudJuridica> {
        try {
            console.log(`❌ Rechazando solicitud de afiliación jurídica ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error('❌ Error al rechazar solicitud jurídica:', error);
            throw new Error('No se pudo rechazar la solicitud jurídica');
        }
    }
}