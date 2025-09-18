import apiAuth from "@/Api/apiAuth";

import type { 
    SolicitudFisica,
    SolicitudFisicaBase,
    SolicitudAfiliacionFisica,
    SolicitudDesconexionFisica,
    SolicitudCambioMedidorFisica,
    SolicitudAsociadoFisica
} from "../Models/ModelosFisicas";

/**
 * 📄 Servicio para gestionar solicitudes de personas físicas
 * Utiliza el endpoint /solicitudes/fisicas/ con apiAuth.get
 */
export class SolicitudesFisicasService {
    
    /**
     * 📥 GET - Obtener todas las solicitudes físicas
     * @returns Promise<SolicitudFisica[]> Lista completa de solicitudes físicas
     */
    static async getSolicitudesFisicas(): Promise<SolicitudFisica[]> {
        try {
            console.log('🔍 Obteniendo todas las solicitudes físicas...');
            const response = await apiAuth.get("/solicitudes/fisicas");
            console.log('📄 Respuesta completa del backend:', response);
            console.log('📊 Datos de la respuesta:', response.data);
            
            let solicitudesFinales: SolicitudFisica[] = [];
            
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
                
                console.log('🔄 Total de solicitudes físicas combinadas:', solicitudesFinales.length);
            } else {
                console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
            }
            
            console.log('✅ Solicitudes físicas procesadas:', solicitudesFinales.length, 'registros');
            return solicitudesFinales;
        } catch (error) {
            console.error('❌ Error al obtener solicitudes físicas:', error);
            throw error;
        }
    }

    // 🔄 Métodos de filtrado local (ya que el backend solo tiene 1 endpoint GET)
    
    /**
     * 📥 Filtrar solicitudes físicas por estado (filtrado local)
     * @param estado Estado de la solicitud
     * @returns Promise<SolicitudFisica[]> Lista filtrada por estado
     */
    static async getSolicitudesPorEstado(estado: string): Promise<SolicitudFisica[]> {
        try {
            console.log(`🔍 Filtrando solicitudes físicas por estado: ${estado}`);
            const todasLasSolicitudes = await this.getSolicitudesFisicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Estado.Nombre_Estado === estado
            );
            console.log(`✅ Solicitudes físicas filtradas por estado ${estado}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`❌ Error al filtrar solicitudes físicas por estado ${estado}:`, error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes físicas pendientes (filtrado local)
     * @returns Promise<SolicitudFisica[]> Lista de solicitudes pendientes
     */
    static async getSolicitudesPendientes(): Promise<SolicitudFisica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes físicas pendientes...');
            return await this.getSolicitudesPorEstado('Pendiente');
        } catch (error) {
            console.error('❌ Error al obtener solicitudes físicas pendientes:', error);
            throw error;
        }
    }

    /**
     * 📥 Filtrar solicitudes físicas por tipo (filtrado local)
     * @param tipo Tipo de solicitud
     * @returns Promise<SolicitudFisica[]> Lista filtrada por tipo
     */
    static async getSolicitudesPorTipo(tipo: SolicitudFisicaBase['Tipo_Solicitud']): Promise<SolicitudFisica[]> {
        try {
            console.log(`🔍 Filtrando solicitudes físicas por tipo: ${tipo}`);
            const todasLasSolicitudes = await this.getSolicitudesFisicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Tipo_Solicitud === tipo
            );
            console.log(`✅ Solicitudes físicas filtradas por tipo ${tipo}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(`❌ Error al filtrar solicitudes físicas por tipo ${tipo}:`, error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de afiliación físicas (filtrado local)
     * @returns Promise<SolicitudAfiliacionFisica[]> Lista de solicitudes de afiliación
     */
    static async getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionFisica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de afiliación físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Afiliacion');
            return solicitudes as SolicitudAfiliacionFisica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de afiliación físicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de desconexión físicas (filtrado local)
     * @returns Promise<SolicitudDesconexionFisica[]> Lista de solicitudes de desconexión
     */
    static async getSolicitudesDesconexion(): Promise<SolicitudDesconexionFisica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de desconexión físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Desconexion');
            return solicitudes as SolicitudDesconexionFisica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de desconexión físicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de cambio de medidor físicas (filtrado local)
     * @returns Promise<SolicitudCambioMedidorFisica[]> Lista de solicitudes de cambio de medidor
     */
    static async getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorFisica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de cambio de medidor físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Cambio de Medidor');
            return solicitudes as SolicitudCambioMedidorFisica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de cambio de medidor físicas:', error);
            throw error;
        }
    }

    /**
     * 📥 Obtener solicitudes de asociado físicas (filtrado local)
     * @returns Promise<SolicitudAsociadoFisica[]> Lista de solicitudes de asociado
     */
    static async getSolicitudesAsociado(): Promise<SolicitudAsociadoFisica[]> {
        try {
            console.log('🔍 Obteniendo solicitudes de asociado físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Asociado');
            return solicitudes as SolicitudAsociadoFisica[];
        } catch (error) {
            console.error('❌ Error al obtener solicitudes de asociado físicas:', error);
            throw error;
        }
    }
}

//  Funciones helper para uso directo (sin clase)
export const getSolicitudesFisicas = () => SolicitudesFisicasService.getSolicitudesFisicas();
export const getSolicitudesFisicasPendientes = () => SolicitudesFisicasService.getSolicitudesPendientes(); 
export const getSolicitudesFisicasAfiliacion = () => SolicitudesFisicasService.getSolicitudesAfiliacion();
export const getSolicitudesFisicasDesconexion = () => SolicitudesFisicasService.getSolicitudesDesconexion();
export const getSolicitudesFisicasCambioMedidor = () => SolicitudesFisicasService.getSolicitudesCambioMedidor();
export const getSolicitudesFisicasAsociado = () => SolicitudesFisicasService.getSolicitudesAsociado();