import apiAuth from "@/Api/apiAuth";
import type { SolicitudJuridica } from "../../Models/ModelosJuridicos";


export class ServiceSolicitudAsociadoJuridicas {
    
 
    static async updateEstado(solicitudId: string | number, nuevoEstadoId: string | number): Promise<SolicitudJuridica> {
        try {
            console.log(` Actualizando estado de solicitud jurídica ${solicitudId} a estado ${nuevoEstadoId}...`);

            const response = await apiAuth.patch<SolicitudJuridica>(
                `/solicitud-asociado-juridica/${solicitudId}/update/estado/${nuevoEstadoId}`
            );
            
            console.log(' Estado de solicitud jurídica actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error(' Error al actualizar estado de solicitud jurídica:', error);
            throw error;
        }
    }

   
    static async aprobar(solicitudId: string | number, estadoAprobadoId: number = 3): Promise<SolicitudJuridica> {
        try {
            console.log(`✅ Aprobando solicitud de afiliación jurídica ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error(' Error al aprobar solicitud jurídica:', error);
            throw new Error('No se pudo aprobar la solicitud jurídica');
        }
    }

    
    static async rechazar(solicitudId: string | number, estadoRechazadoId: number = 4): Promise<SolicitudJuridica> {
        try {
            console.log(` Rechazando solicitud de afiliación jurídica ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error(' Error al rechazar solicitud jurídica:', error);
            throw new Error('No se pudo rechazar la solicitud jurídica');
        }
    }
}