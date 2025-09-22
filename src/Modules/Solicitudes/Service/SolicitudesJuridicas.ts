import apiAuth from "@/Api/apiAuth";

import type { 
    SolicitudJuridica, 
    SolicitudJuridicaBase, 
    SolicitudAfiliacionJuridica,
    SolicitudDesconexionJuridica,
    SolicitudCambioMedidorJuridica,
    SolicitudAsociadoJuridica 
} from "../Models/ModelosJuridicos";


export class SolicitudesJuridicasService {
    
   
    static async getSolicitudesJuridicas(): Promise<SolicitudJuridica[]> {
        try {
            const response = await apiAuth.get("/solicitudes/juridicas");
            
            let solicitudesFinales: SolicitudJuridica[] = [];
            
            // El backend devuelve un objeto con propiedades por tipo de solicitud
            if (response.data && typeof response.data === 'object') {
                const data = response.data;
                
                // Mapear tipos de solicitud del backend a tipos esperados
                const tiposSolicitud = [
                    { key: 'afiliacion', tipo: 'Afiliacion' },
                    { key: 'asociado', tipo: 'Asociado' },
                    { key: 'cambioMedidor', tipo: 'Cambio de Medidor' },
                    { key: 'desconexion', tipo: 'Desconexion' }
                ];
                
                tiposSolicitud.forEach(({ key, tipo }) => {
                    if (data[key] && Array.isArray(data[key])) {
                        // Agregar el tipo de solicitud a cada registro
                        const solicitudesConTipo = data[key].map((solicitud: any) => ({
                            ...solicitud,
                            Tipo_Solicitud: tipo
                        }));
                        
                        solicitudesFinales = [...solicitudesFinales, ...solicitudesConTipo];
                    }
                });
            } else {
                console.warn('Estructura de respuesta inesperada:', response.data);
            }
            
            return solicitudesFinales;
        } catch (error) {
            console.error('Error al obtener solicitudes jurídicas:', error);
            throw error;
        }
    }

    
    static async getSolicitudesPorEstado(estado: string): Promise<SolicitudJuridica[]> {
        try {
            const todasLasSolicitudes = await this.getSolicitudesJuridicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Estado.Nombre_Estado === estado
            );
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`Error al filtrar solicitudes jurídicas por estado ${estado}:`, error);
            throw error;
        }
    }

   
    static async getSolicitudesPendientes(): Promise<SolicitudJuridica[]> {
        try {
            return await this.getSolicitudesPorEstado('Pendiente');
        } catch (error) {
            console.error('Error al obtener solicitudes jurídicas pendientes:', error);
            throw error;
        }
    }

   
    static async getSolicitudesPorTipo(tipo: SolicitudJuridicaBase['Tipo_Solicitud']): Promise<SolicitudJuridica[]> {
        try {
            const todasLasSolicitudes = await this.getSolicitudesJuridicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Tipo_Solicitud === tipo
            );
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`Error al filtrar solicitudes jurídicas por tipo ${tipo}:`, error);
            throw error;
        }
    }

    static async getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionJuridica[]> {
        try {
            const solicitudes = await this.getSolicitudesPorTipo('Afiliacion');
            return solicitudes as SolicitudAfiliacionJuridica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de afiliación jurídicas:', error);
            throw error;
        }
    }

   
    static async getSolicitudesDesconexion(): Promise<SolicitudDesconexionJuridica[]> {
        try {
            const solicitudes = await this.getSolicitudesPorTipo('Desconexion');
            return solicitudes as SolicitudDesconexionJuridica[];
        } catch (error) {
            console.error('Error al obtener solicitudes de desconexión jurídicas:', error);
            throw error;
        }
    }

   
    static async getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorJuridica[]> {
        try {
            const solicitudes = await this.getSolicitudesPorTipo('Cambio de Medidor');
            return solicitudes as SolicitudCambioMedidorJuridica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de cambio de medidor jurídicas:', error);
            throw error;
        }
    }

   
    static async getSolicitudesAsociado(): Promise<SolicitudAsociadoJuridica[]> {
        try {
            const solicitudes = await this.getSolicitudesPorTipo('Asociado');
            return solicitudes as SolicitudAsociadoJuridica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de asociado jurídicas:', error);
            throw error;
        }
    }
}

// Funciones helper para uso directo (sin clase)
export const getSolicitudesJuridicas = () => SolicitudesJuridicasService.getSolicitudesJuridicas();
export const getSolicitudesJuridicasPendientes = () => SolicitudesJuridicasService.getSolicitudesPendientes(); 
export const getSolicitudesJuridicasAfiliacion = () => SolicitudesJuridicasService.getSolicitudesAfiliacion();
export const getSolicitudesJuridicasDesconexion = () => SolicitudesJuridicasService.getSolicitudesDesconexion();
export const getSolicitudesJuridicasCambioMedidor = () => SolicitudesJuridicasService.getSolicitudesCambioMedidor();
export const getSolicitudesJuridicasAsociado = () => SolicitudesJuridicasService.getSolicitudesAsociado();