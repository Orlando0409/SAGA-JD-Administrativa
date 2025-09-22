
import apiAuth from "@/Api/apiAuth";
import type { SolicitudJuridica } from "../../Models/ModelosJuridicos";




export class ServiceSolicitudCambioMedidorJuridicas {
    
    static async updateEstado(solicitudId: string | number, nuevoEstadoId: string | number): Promise<SolicitudJuridica> {
        try {
            console.log(` Actualizando estado de solicitud de cambio de medidor ${solicitudId} a estado ${nuevoEstadoId}...`);
            
            const response = await apiAuth.patch<SolicitudJuridica>(
                `/solicitud-cambio-medidor-juridica/${solicitudId}/update/estado/${nuevoEstadoId}`
            );
            
            console.log(' Estado de solicitud de cambio de medidor actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error(' Error al actualizar estado de solicitud de cambio de medidor:', error);
            throw error;
        }
    }

  
    static async aprobar(solicitudId: string | number, estadoAprobadoId: number = 3): Promise<SolicitudJuridica> {
        try {
            console.log(` Aprobando solicitud de cambio de medidor ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error(' Error al aprobar solicitud de cambio de medidor:', error);
            throw new Error('No se pudo aprobar la solicitud de cambio de medidor');
        }
    }

    
    static async rechazar(solicitudId: string | number, estadoRechazadoId: number = 4): Promise<SolicitudJuridica> {
        try {
            console.log(` Rechazando solicitud de cambio de medidor ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error(' Error al rechazar solicitud de cambio de medidor:', error);
            throw new Error('No se pudo rechazar la solicitud de cambio de medidor');
        }
    }
}