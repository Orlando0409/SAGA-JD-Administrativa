import apiAuth from "@/Api/apiAuth";
import type {
    SolicitudFisica,
    SolicitudFisicaBase,
    SolicitudAfiliacionFisica,
    SolicitudDesconexionFisica,
    SolicitudCambioMedidorFisica,
    SolicitudAsociadoFisica
} from "../Models/ModelosFisicas";

// GET - Obtener todas las solicitudes físicas

export async function getSolicitudesFisicas(): Promise<SolicitudFisica[]> {
    try {
        let response;

        try {
            response = await apiAuth.get("/solicitudes-fisicas/all");
        } catch (error) {
            console.error("Error al obtener solicitudes físicas:", error);
            throw error;
        }

        let solicitudesFinales: SolicitudFisica[] = [];

        // Verificar si el backend devuelve directamente un array o un objeto con propiedades
        if (Array.isArray(response.data)) {

            // El backend devuelve directamente un array de solicitudes
            solicitudesFinales = response.data.map((solicitud: any) => {

                // Determinar el tipo de solicitud basado en Id_Tipo_Solicitud
                let tipo = 'Afiliacion';
                switch (solicitud.Id_Tipo_Solicitud) {
                    case 1: tipo = 'Afiliacion'; break;
                    case 2: tipo = 'Desconexion'; break;
                    case 3: tipo = 'Cambio de Medidor'; break;
                    case 4: tipo = 'Asociado'; break;
                    case 5: tipo = 'Medidor Extra'; break;
                    default: tipo = 'Afiliacion';
                }

                return {
                    ...solicitud,
                    Tipo_Solicitud: tipo
                };
            });

        } else if (response.data && typeof response.data === 'object') {
            const data = response.data;

            // Mapear tipos de solicitud del backend a tipos esperados (estructura real del backend)
            const tiposSolicitud = [
                { key: 'Afiliacion', tipo: 'Afiliacion' },
                { key: 'Asociado', tipo: 'Asociado' },
                { key: 'Cambio De Medidor', tipo: 'Cambio de Medidor' },  // ⚠️ Key exacta del backend
                { key: 'Desconexion', tipo: 'Desconexion' },
                { key: 'Medidor Extra', tipo: 'Medidor Extra' }
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
        console.error(" Error al obtener solicitudes físicas:", error);
        throw error;
    }
}

export async function getSolicitudesPorEstado(estado: string): Promise<SolicitudFisica[]> {
    try {
        const todasLasSolicitudes = await getSolicitudesFisicas();
        return todasLasSolicitudes.filter(solicitud => solicitud.Estado.Nombre_Estado === estado);
    } catch (error) {
        console.error(` Error al obtener solicitudes físicas por estado ${estado}:`, error);
        throw error;
    }
}

export async function getSolicitudesPendientes(): Promise<SolicitudFisica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-fisicas/pendientes");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes físicas pendientes:', error);
        throw error;
    }
}

export async function getSolicitudesPorTipo(tipo: SolicitudFisicaBase['Tipo_Solicitud']): Promise<SolicitudFisica[]> {
    try {
        const response = await apiAuth.get(`/solicitudes-fisicas/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        console.error(` Error al obtener solicitudes físicas por tipo ${tipo}:`, error);
        throw error;
    }
}

export async function getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionFisica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-fisicas/afiliacion");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de afiliación físicas:', error);
        throw error;
    }
}

export async function getSolicitudesDesconexion(): Promise<SolicitudDesconexionFisica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-fisicas/desconexion");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de desconexión físicas:', error);
        throw error;
    }
}

export async function getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorFisica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-fisicas/cambio-medidor");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de cambio de medidor físicas:', error);
        throw error;
    }
}

export async function getSolicitudesAsociado(): Promise<SolicitudAsociadoFisica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-fisicas/asociado");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de asociado físicas:', error);
        throw error;
    }
}

export async function getSolicitudesMedidorExtra(): Promise<SolicitudFisica[]> {
    try {
        const response = await apiAuth.get('/solicitudes-fisicas/tipo/Medidor Extra');
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de medidor extra físicas:', error);
        throw error;
    }
}