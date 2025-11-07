import apiAuth from "@/Api/apiAuth";
import type { SolicitudFisica } from "../../Models/ModelosFisicas";


export class ServiceSolicitudAfiliacionFisica {

    static async updateEstado(
        solicitudId: string | number,
        nuevoEstadoId: string | number
    ): Promise<SolicitudFisica> {
        try {
            console.log(`Actualizando solicitud ${solicitudId} → estado ${nuevoEstadoId}`);

            const response = await apiAuth.patch<SolicitudFisica>(
                `/solicitudes-fisicas/update/estado/afiliacion/${solicitudId}/${nuevoEstadoId}`
            );

            console.log(" Estado actualizado correctamente:", response.data);
            return response.data;
        } catch (error) {
            console.error(" Error al actualizar estado de solicitud:", error);
            throw error;
        }
    }

    static async EnRevision(
        solicitudId: string | number,
        estadoPendienteId: number = 2
    ): Promise<SolicitudFisica> {
        try {
            console.log(` Marcando solicitud ${solicitudId} como en revisión...`);
            return await this.updateEstado(solicitudId, estadoPendienteId);
        } catch (error) {
            console.error("Error al marcar como en revisión:", error);
            throw new Error("No se pudo cambiar a estado en revisión");
        }
    }


    static async AprobarYEnEspera(
        solicitudId: string | number,
        estadoAprobadoId: number = 3
    ): Promise<SolicitudFisica> {
        try {
            console.log(`🟢 Aprobando solicitud ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoAprobadoId);
        } catch (error) {
            console.error(" Error al aprobar solicitud:", error);
            throw new Error("No se pudo aprobar la solicitud de afiliación");
        }
    }

    static async Completado(
        solicitudId: string | number,
        estadoProcesoId: number = 4
    ): Promise<SolicitudFisica> {
        try {
            console.log(` Marcando solicitud ${solicitudId} como completada...`);
            return await this.updateEstado(solicitudId, estadoProcesoId);
        } catch (error) {
            console.error(" Error al cambiar a estado completado:", error);
            throw new Error("No se pudo cambiar a estado 'completado    '");
        }
    }

    static async Rechazar(
        solicitudId: string | number,
        estadoRechazadoId: number = 5
    ): Promise<SolicitudFisica> {
        try {
            console.log(`🟥 Rechazando solicitud ${solicitudId}...`);
            return await this.updateEstado(solicitudId, estadoRechazadoId);
        } catch (error) {
            console.error(" Error al rechazar solicitud:", error);
            throw new Error("No se pudo rechazar la solicitud");
        }
    }
}

//Medidor 



