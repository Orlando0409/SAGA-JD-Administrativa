import apiAuth from "@/Api/apiAuth";
import type {
    SolicitudJuridica,
    SolicitudJuridicaBase,
    SolicitudAfiliacionJuridica,
    SolicitudDesconexionJuridica,
    SolicitudCambioMedidorJuridica,
    SolicitudAsociadoJuridica
} from "../Models/ModelosJuridicos";

// GET - Obtener todas las solicitudes jurídicas

export async function getSolicitudesJuridicas(): Promise<SolicitudJuridica[]> {
    try {
        let response;

        try {
            response = await apiAuth.get("/solicitudes-juridicas/all");
        } catch (error) {
            console.error("Error al obtener solicitudes jurídicas:", error);
            throw error;
        }

        let solicitudesFinales: SolicitudJuridica[] = [];

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
                { key: 'Desconexion', tipo: 'Desconexion' }
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
        console.error(" Error al obtener solicitudes jurídicas:", error);
        throw error;
    }
}

export async function getSolicitudesPorEstado(estado: string): Promise<SolicitudJuridica[]> {
    try {
        const todasLasSolicitudes = await getSolicitudesJuridicas();
        return todasLasSolicitudes.filter(solicitud => solicitud.Estado.Nombre_Estado === estado);
    } catch (error) {
        console.error(` Error al obtener solicitudes jurídicas por estado ${estado}:`, error);
        throw error;
    }
}

export async function getSolicitudesPendientes(): Promise<SolicitudJuridica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-juridicas/pendientes");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes jurídicas pendientes:', error);
        throw error;
    }
}

export async function getSolicitudesPorTipo(tipo: SolicitudJuridicaBase['Tipo_Solicitud']): Promise<SolicitudJuridica[]> {
    try {
        const response = await apiAuth.get(`/solicitudes-juridicas/tipo/${tipo}`);
        return response.data;
    } catch (error) {
        console.error(` Error al obtener solicitudes jurídicas por tipo ${tipo}:`, error);
        throw error;
    }
}

export async function getSolicitudesAfiliacion(): Promise<SolicitudAfiliacionJuridica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-juridicas/afiliacion");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de afiliación jurídicas:', error);
        throw error;
    }
}

export async function getSolicitudesDesconexion(): Promise<SolicitudDesconexionJuridica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-juridicas/desconexion");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de desconexión jurídicas:', error);
        throw error;
    }
}

export async function getSolicitudesCambioMedidor(): Promise<SolicitudCambioMedidorJuridica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-juridicas/cambio-medidor");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de cambio de medidor jurídicas:', error);
        throw error;
    }
}

export async function getSolicitudesAsociado(): Promise<SolicitudAsociadoJuridica[]> {
    try {
        const response = await apiAuth.get("/solicitudes-juridicas/asociado");
        return response.data;
    } catch (error) {
        console.error(' Error al obtener solicitudes de asociado jurídicas:', error);
        throw error;
    }
}