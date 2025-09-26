import apiAuth from "@/Api/apiAuth";
import type { SolicitudFisica } from "../../Models/ModelosFisicas";


export class ServiceSolicitudAfiliacion {
    
    
     // PUT - Actualizar estado de una solicitud de afiliación física
     
    static async updateEstado(solicitudId: string | number, nuevoEstadoId: string | number): Promise<SolicitudFisica> {
        try {
            console.log(` Actualizando estado de solicitud ${solicitudId} a estado ${nuevoEstadoId}...`);

            const response = await apiAuth.patch<SolicitudFisica>(
                `/solicitud-afiliacion-fisica/${solicitudId}/update/estado/${nuevoEstadoId}`
            );
            
            console.log(' Estado de solicitud actualizado exitosamente:', response.data);
            return response.data;
        } catch (error) {
            console.error(' Error al actualizar estado de solicitud:', error);
            throw error;
        }
    }

  
    static async aprobar(solicitudId: string | number, estadoAprobadoId: number = 3): Promise<SolicitudFisica> {
        try {
            console.log(` Aprobando solicitud de afiliación ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error(' Error al aprobar solicitud:', error);
            throw new Error('No se pudo aprobar la solicitud');
        }
    }

    //Rechazar solicitud de afiliación física (cambiar a estado "Rechazada")
    
    static async rechazar(solicitudId: string | number, estadoRechazadoId: number = 4): Promise<SolicitudFisica> {
        try {
            console.log(` Rechazando solicitud de afiliación ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
            throw new Error('No se pudo rechazar la solicitud');
        }
    }
}