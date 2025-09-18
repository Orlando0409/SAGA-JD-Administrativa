import apiAuth from "@/Api/apiAuth";

import type { 
    SolicitudJuridica, 
    SolicitudJuridicaBase, 
    SolicitudAfiliacionJuridica,
    SolicitudDesconexionJuridica,
    SolicitudCambioMedidorJuridica,
    SolicitudAsociadoJuridica 
} from "../Models/ModelosJuridicos";

/**
 * 📄 Servicio para gestionar solicitudes de personas jurídicas
 * Utiliza el endpoint /solicitudes/juridicas/ con apiAuth.get
 */
export class SolicitudesJuridicasService {
    
    /**
     * 📥 GET - Obtener todas las solicitudes jurídicas
     * @returns Promise<SolicitudJuridica[]> Lista completa de solicitudes jurídicas
     */
    static async getSolicitudesJuridicas(): Promise<SolicitudJuridica[]> {
        try {
            console.log('🔍 Obteniendo todas las solicitudes jurídicas...');
            const response = await apiAuth.get("/solicitudes/juridicas");
            console.log('📄 Respuesta completa del backend:', response);
            console.log('📊 Datos de la respuesta:', response.data);
            
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
                        console.log(`📋 Encontradas ${data[key].length} solicitudes de tipo: ${tipo}`);
                        
                        // Agregar el tipo de solicitud a cada registro
                        const solicitudesConTipo = data[key].map((solicitud: any) => ({
                            ...solicitud,
                            Tipo_Solicitud: tipo
                        }));
                        
                        solicitudesFinales = [...solicitudesFinales, ...solicitudesConTipo];
                    }
                });
                
                console.log('🔄 Total de solicitudes jurídicas combinadas:', solicitudesFinales.length);
            } else {
                console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
            }
            
            console.log('✅ Solicitudes jurídicas procesadas:', solicitudesFinales.length, 'registros');
            return solicitudesFinales;
        } catch (error) {
            console.error('❌ Error al obtener solicitudes jurídicas:', error);
            throw error;
        }
    }

    // 🔄 Métodos de filtrado local (ya que el backend solo tiene 1 endpoint GET)
    
    /**
     * 📥 Filtrar solicitudes jurídicas por estado (filtrado local)
     * @param estado Estado de la solicitud
     * @returns Promise<SolicitudJuridica[]> Lista filtrada por estado
     */
    static async getSolicitudesPorEstado(estado: string): Promise<SolicitudJuridica[]> {
        try {
            console.log(`🔍 Filtrando solicitudes jurídicas por estado: ${estado}`);
            const todasLasSolicitudes = await this.getSolicitudesJuridicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Estado.Nombre_Estado === estado
            );
            console.log(`✅ Solicitudes jurídicas filtradas por estado ${estado}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`❌ Error al filtrar solicitudes jurídicas por estado ${estado}:`, error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes jurídicas pendientes (filtrado local)
     * @returns Promise<SolicitudJuridica[]> Lista de solicitudes pendientes
     */
    static async getSolicitudesPendientes(): Promise<SolicitudJuridica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes jurídicas pendientes...');
            return await this.getSolicitudesPorEstado('Pendiente');
        } catch (error) {
            console.error('❌ Error al obtener solicitudes jurídicas pendientes:', error);
            throw error;
        }
    }

    /**
     * 📥 Filtrar solicitudes jurídicas por tipo (filtrado local)
     * @param tipo Tipo de solicitud
     * @returns Promise<SolicitudJuridica[]> Lista filtrada por tipo
     */
    static async getSolicitudesPorTipo(tipo: SolicitudJuridicaBase['Tipo_Solicitud']): Promise<SolicitudJuridica[]> {
        try {
            console.log(`🔍 Filtrando solicitudes jurídicas por tipo: ${tipo}`);
            const todasLasSolicitudes = await this.getSolicitudesJuridicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Tipo_Solicitud === tipo
            );
            console.log(`✅ Solicitudes jurídicas filtradas por tipo ${tipo}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`❌ Error al filtrar solicitudes jurídicas por tipo ${tipo}:`, error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de afiliación jurídicas (filtrado local)
     * @returns Promise<SolicitudAfiliacionJuridica[]> Lista de solicitudes de afiliación
     */
    static async getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionJuridica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de afiliación jurídicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Afiliacion');
            return solicitudes as SolicitudAfiliacionJuridica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de afiliación jurídicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de desconexión jurídicas (filtrado local)
     * @returns Promise<SolicitudDesconexionJuridica[]> Lista de solicitudes de desconexión
     */
    static async getSolicitudesDesconexion(): Promise<SolicitudDesconexionJuridica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de desconexión jurídicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Desconexion');
            return solicitudes as SolicitudDesconexionJuridica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de desconexión jurídicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de cambio de medidor jurídicas (filtrado local)
     * @returns Promise<SolicitudCambioMedidorJuridica[]> Lista de solicitudes de cambio de medidor
     */
    static async getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorJuridica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de cambio de medidor jurídicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Cambio de Medidor');
            return solicitudes as SolicitudCambioMedidorJuridica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de cambio de medidor jurídicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de asociado jurídicas (filtrado local)
     * @returns Promise<SolicitudAsociadoJuridica[]> Lista de solicitudes de asociado
     */
    static async getSolicitudesAsociado(): Promise<SolicitudAsociadoJuridica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de asociado jurídicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Asociado');
            return solicitudes as SolicitudAsociadoJuridica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de asociado jurídicas:', error);
            throw error;
        }
    }
}

// 📥 Funciones helper para uso directo (sin clase)
export const getSolicitudesJuridicas = () => SolicitudesJuridicasService.getSolicitudesJuridicas();
export const getSolicitudesJuridicasPendientes = () => SolicitudesJuridicasService.getSolicitudesPendientes(); 
export const getSolicitudesJuridicasAfiliacion = () => SolicitudesJuridicasService.getSolicitudesAfiliacion();
export const getSolicitudesJuridicasDesconexion = () => SolicitudesJuridicasService.getSolicitudesDesconexion();
export const getSolicitudesJuridicasCambioMedidor = () => SolicitudesJuridicasService.getSolicitudesCambioMedidor();
export const getSolicitudesJuridicasAsociado = () => SolicitudesJuridicasService.getSolicitudesAsociado();