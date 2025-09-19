
import apiAuth from "@/Api/apiAuth";
import type { SolicitudFisica } from "../../Models/ModelosFisicas";

/**
 * 🔄 Servicio para gestionar estados de solicitudes de cambio de medidor físicas
 * Utiliza el endpoint /:id/update/estado/:nuevoEstadoId
 */
export class ServiceSolicitudCambioMedidor {
    
    /**
     * 🔄 PUT - Actualizar estado de una solicitud de cambio de medidor 
     * @param solicitudId ID de la solicitud a actualizar
     * @param nuevoEstadoId ID del nuevo estado
     * @returns Promise<SolicitudFisica> Solicitud actualizada
     */
    static async updateEstado(solicitudId: string | number, nuevoEstadoId: string | number): Promise<SolicitudFisica> {
        try {
            console.log(`🔄 Actualizando estado de solicitud de cambio de medidor ${solicitudId} a estado ${nuevoEstadoId}...`);
            
            const response = await apiAuth.patch<SolicitudFisica>(
                `/solicitud-cambio-medidor-fisica/${solicitudId}/update/estado/${nuevoEstadoId}`
            );
            
            console.log('✅ Estado de solicitud de cambio de medidor actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error al actualizar estado de solicitud de cambio de medidor:', error);
            throw error;
        }
    }

    /**
     * ✅ Aprobar solicitud de cambio de medidor física (cambiar a estado "Aprobada")
     * @param solicitudId ID de la solicitud
     * @param estadoAprobadoId ID del estado "Aprobada" (por defecto 3)
     * @returns Promise<SolicitudFisica> Solicitud aprobada
     */
    static async aprobar(solicitudId: string | number, estadoAprobadoId: number = 3): Promise<SolicitudFisica> {
        try {
            console.log(`✅ Aprobando solicitud de cambio de medidor ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error('❌ Error al aprobar solicitud de cambio de medidor:', error);
            throw new Error('No se pudo aprobar la solicitud de cambio de medidor');
        }
    }

    /**
     * ❌ Rechazar solicitud de cambio de medidor física (cambiar a estado "Rechazada")
     * @param solicitudId ID de la solicitud
     * @param estadoRechazadoId ID del estado "Rechazada" (por defecto 4)
     * @returns Promise<SolicitudFisica> Solicitud rechazada
     */
    static async rechazar(solicitudId: string | number, estadoRechazadoId: number = 4): Promise<SolicitudFisica> {
        try {
            console.log(`❌ Rechazando solicitud de cambio de medidor ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error('❌ Error al rechazar solicitud de cambio de medidor:', error);
            throw new Error('No se pudo rechazar la solicitud de cambio de medidor');
        }
    }
}