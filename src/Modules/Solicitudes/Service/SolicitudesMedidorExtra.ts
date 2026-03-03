import apiAuth from '@/Api/apiAuth';
import type {
    CreateSolicitudMedidorExtraFisicaDto,
    CreateSolicitudMedidorExtraJuridicaDto,
    SolicitudMedidorExtraItem,
    SolicitudMedidorExtraResponse,
} from '../Models/ModeloSolicitudMedidorExtra';

export async function crearSolicitudMedidorExtraFisica(
    dto: CreateSolicitudMedidorExtraFisicaDto
): Promise<SolicitudMedidorExtraResponse> {
    try {
        const response = await apiAuth.post<SolicitudMedidorExtraResponse>(
            '/solicitudes-medidor-extra/fisica',
            dto
        );

        return response.data;
    } catch (error) {
        console.error('Error al crear solicitud de medidor extra (física):', error);
        throw error;
    }
}

export async function crearSolicitudMedidorExtraJuridica(
    dto: CreateSolicitudMedidorExtraJuridicaDto
): Promise<SolicitudMedidorExtraResponse> {
    try {
        const response = await apiAuth.post<SolicitudMedidorExtraResponse>(
            '/solicitudes-medidor-extra/juridica',
            dto
        );

        return response.data;
    } catch (error) {
        console.error('Error al crear solicitud de medidor extra (jurídica):', error);
        throw error;
    }
}

export async function getSolicitudesMedidorExtraPorIdentificacion(
    identificacion: string
): Promise<SolicitudMedidorExtraItem[]> {
    try {
        const response = await apiAuth.get<SolicitudMedidorExtraItem[]>(
            `/solicitudes-medidor-extra/por-identificacion/${identificacion}`
        );

        return response.data;
    } catch (error) {
        console.error(
            `Error al obtener solicitudes de medidor extra por identificación ${identificacion}:`,
            error
        );
        throw error;
    }
}
