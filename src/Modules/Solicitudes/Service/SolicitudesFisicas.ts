import apiAuth from "@/Api/apiAuth";

import type { 
    SolicitudFisica,
    SolicitudFisicaBase,
    SolicitudAfiliacionFisica,
    SolicitudDesconexionFisica,
    SolicitudCambioMedidorFisica,
    SolicitudAsociadoFisica
} from "../Models/ModelosFisicas";





//Servicio para gestionar solicitudes de personas físicas

export class SolicitudesFisicasService {
    
// GET - Obtener todas las solicitudes físicas
    
    static async getSolicitudesFisicas(): Promise<SolicitudFisica[]> {
        try {
            console.log('🔍 Obteniendo todas las solicitudes físicas...');
            console.log('🔍 URL del backend:', 'http://localhost:3000/api/solicitudes/fisicas');
            console.log('🔍 Cookies disponibles:', document.cookie);
            
            // TEMPORAL: Probar tanto con autenticación como sin ella para debug
            let response;
            try {
                response = await apiAuth.get("/solicitudes/fisicas");
                console.log('✅ Petición con autenticación exitosa');
            } catch (authError: any) {
                console.log('❌ Error con autenticación:', authError.response?.status);
                if (authError.response?.status === 401) {
                    console.log('🔧 Probando sin autenticación...');
                    // Hacer petición directa sin autenticación para testing
                    response = await fetch('http://localhost:3000/api/solicitudes/fisicas')
                        .then(res => {
                            if (!res.ok) throw new Error(`HTTP ${res.status}`);
                            return res.json();
                        })
                        .then(data => ({ data }));
                    console.log('✅ Petición sin autenticación exitosa');
                } else {
                    throw authError;
                }
            }
            console.log('🔍 Respuesta completa del backend:', response);
            console.log('🔍 Datos de la respuesta:', response.data);
            
            let solicitudesFinales: SolicitudFisica[] = [];
            
            // Verificar si el backend devuelve directamente un array o un objeto con propiedades
            if (Array.isArray(response.data)) {
                console.log('📋 Backend devuelve array directo con', response.data.length, 'solicitudes');
                
                // El backend devuelve directamente un array de solicitudes
                solicitudesFinales = response.data.map((solicitud: any) => {
                    console.log('🔍 Procesando solicitud directa:', solicitud);
                    
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
                console.log('📋 Backend devuelve objeto con propiedades anidadas');
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
                        console.log(`📋 Encontradas ${data[key].length} solicitudes de tipo: ${tipo}`);
                        
                        // Agregar el tipo de solicitud a cada registro
                        const solicitudesConTipo = data[key].map((solicitud: any) => ({
                            ...solicitud,
                            Tipo_Solicitud: tipo
                        }));
                        
                        solicitudesFinales = [...solicitudesFinales, ...solicitudesConTipo];
                    }
                });
            } else {
                console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
            }
            
            console.log('📊 Total de solicitudes físicas procesadas:', solicitudesFinales.length);
            
            console.log(' Solicitudes físicas procesadas:', solicitudesFinales.length, 'registros');
            return solicitudesFinales;
        } catch (error) {
            console.error(' Error al obtener solicitudes físicas:', error);
            throw error;
        }
    }

    
    static async getSolicitudesPorEstado(estado: string): Promise<SolicitudFisica[]> {
        try {
            console.log(` Filtrando solicitudes físicas por estado: ${estado}`);
            const todasLasSolicitudes = await this.getSolicitudesFisicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Estado.Nombre_Estado === estado
            );
            console.log(` Solicitudes físicas filtradas por estado ${estado}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(` Error al filtrar solicitudes físicas por estado ${estado}:`, error);
            throw error;
        }
    }

    
    static async getSolicitudesPendientes(): Promise<SolicitudFisica[]> {
        try {
            console.log(' Obteniendo solicitudes físicas pendientes...');
            return await this.getSolicitudesPorEstado('Pendiente');
        } catch (error) {
            console.error(' Error al obtener solicitudes físicas pendientes:', error);
            throw error;
        }
    }

   
    static async getSolicitudesPorTipo(tipo: SolicitudFisicaBase['Tipo_Solicitud']): Promise<SolicitudFisica[]> {
        try {
            console.log(` Filtrando solicitudes físicas por tipo: ${tipo}`);
            const todasLasSolicitudes = await this.getSolicitudesFisicas();
            const solicitudesFiltradas = todasLasSolicitudes.filter(solicitud => 
                solicitud.Tipo_Solicitud === tipo
            );
            console.log(` Solicitudes físicas filtradas por tipo ${tipo}:`, solicitudesFiltradas.length, 'registros');
            return solicitudesFiltradas;
        } catch (error) {
            console.error(` Error al filtrar solicitudes físicas por tipo ${tipo}:`, error);
            throw error;
        }
    }

   
    static async getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionFisica[]> {
        try {
            console.log(' Obteniendo solicitudes de afiliación físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Afiliacion');
            return solicitudes as SolicitudAfiliacionFisica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de afiliación físicas:', error);
            throw error;
        }
    }

   
    static async getSolicitudesDesconexion(): Promise<SolicitudDesconexionFisica[]> {
        try {
            console.log(' Obteniendo solicitudes de desconexión físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Desconexion');
            return solicitudes as SolicitudDesconexionFisica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de desconexión físicas:', error);
            throw error;
        }
    }

    static async getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorFisica[]> {
        try {
            console.log(' Obteniendo solicitudes de cambio de medidor físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Cambio de Medidor');
            return solicitudes as SolicitudCambioMedidorFisica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de cambio de medidor físicas:', error);
            throw error;
        }
    }

   
    static async getSolicitudesAsociado(): Promise<SolicitudAsociadoFisica[]> {
        try {
            console.log(' Obteniendo solicitudes de asociado físicas...');
            const solicitudes = await this.getSolicitudesPorTipo('Asociado');
            return solicitudes as SolicitudAsociadoFisica[];
        } catch (error) {
            console.error(' Error al obtener solicitudes de asociado físicas:', error);
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