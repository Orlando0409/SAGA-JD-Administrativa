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
            console.log('🔍 Obteniendo solicitudes jurídicas...');
            const response = await apiAuth.get("/solicitudes/juridicas");
            console.log('🔍 Respuesta jurídicas completa:', response);
            console.log('🔍 Datos jurídicas:', response.data);
            
            let solicitudesFinales: SolicitudJuridica[] = [];
            
            // Verificar si el backend devuelve directamente un array o un objeto con propiedades
            if (Array.isArray(response.data)) {
                console.log('📋 Backend devuelve array directo con', response.data.length, 'solicitudes jurídicas');
                
                // El backend devuelve directamente un array de solicitudes
                solicitudesFinales = response.data.map((solicitud: any) => {
                    console.log('🔍 Procesando solicitud jurídica directa:', solicitud);
                    
                    // Determinar el tipo de solicitud basado en Id_Tipo_Solicitud
                    let tipo = 'Afiliacion';
                    switch(solicitud.Id_Tipo_Solicitud) {
                        case 1: tipo = 'Afiliacion'; break;
                        case 2: tipo = 'Desconexion'; break;
                        case 3: tipo = 'Cambio de Medidor'; break;
                        case 4: tipo = 'Asociado'; break;
                        default: tipo = 'Afiliacion';
                    }
                    
                    return {
                        ...solicitud,
                        Tipo_Solicitud: tipo
                    };
                });
                
            } else if (response.data && typeof response.data === 'object') {
                console.log('📋 Backend devuelve objeto con propiedades anidadas (jurídicas)');
                const data = response.data;
                
                // Mapear tipos de solicitud del backend a tipos esperados (estructura real del backend)
                const tiposSolicitud = [
                    { key: 'Afiliacion', tipo: 'Afiliacion' },
                    { key: 'Asociado', tipo: 'Asociado' },
                    { key: 'CambioMedidor', tipo: 'Cambio de Medidor' },
                    { key: 'Desconexion', tipo: 'Desconexion' }
                ];
                
                tiposSolicitud.forEach(({ key, tipo }) => {
                    if (data[key] && Array.isArray(data[key])) {
                        console.log(`📋 Encontradas ${data[key].length} solicitudes jurídicas de tipo: ${tipo}`);
                        
                        // Agregar el tipo de solicitud a cada registro
                        const solicitudesConTipo = data[key].map((solicitud: any) => ({
                            ...solicitud,
                            Tipo_Solicitud: tipo
                        }));
                        
                        solicitudesFinales = [...solicitudesFinales, ...solicitudesConTipo];
                    }
                });
            } else {
                console.warn('⚠️ Estructura de respuesta inesperada (jurídicas):', response.data);
            }
            
            console.log('📊 Total de solicitudes jurídicas procesadas:', solicitudesFinales.length);
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