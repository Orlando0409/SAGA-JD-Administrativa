import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type {
    CreateSolicitudMedidorExtraFisicaDto,
    CreateSolicitudMedidorExtraJuridicaDto,
    SolicitudMedidorExtraItem,
    SolicitudMedidorExtraResponse,
} from '../Models/ModeloSolicitudMedidorExtra';
import {
    crearSolicitudMedidorExtraFisica,
    crearSolicitudMedidorExtraJuridica,
    getSolicitudesMedidorExtraPorIdentificacion,
} from '../Service/SolicitudesMedidorExtra';

const invalidarCachesRelacionadas = async (queryClient: ReturnType<typeof useQueryClient>) => {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['solicitudes-fisicas'] }),
        queryClient.invalidateQueries({ queryKey: ['solicitudes-juridicas'] }),
        queryClient.invalidateQueries({ queryKey: ['afiliadosFisicos'] }),
        queryClient.invalidateQueries({ queryKey: ['afiliadosJuridicos'] }),
        queryClient.invalidateQueries({ queryKey: ['afiliados'] }),
    ]);
};

export const useCrearSolicitudMedidorExtraFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    return useMutation<SolicitudMedidorExtraResponse, any, CreateSolicitudMedidorExtraFisicaDto>({
        mutationFn: (dto) => crearSolicitudMedidorExtraFisica(dto),
        onSuccess: async () => {
            await invalidarCachesRelacionadas(queryClient);
            showSuccess(
                'Solicitud enviada',
                'La solicitud de medidor extra (física) fue registrada correctamente'
            );
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message ||
                'No se pudo registrar la solicitud de medidor extra (física).';
            showError('Error al enviar solicitud', errorMessage);
        },
    });
};

export const useCrearSolicitudMedidorExtraJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    return useMutation<SolicitudMedidorExtraResponse, any, CreateSolicitudMedidorExtraJuridicaDto>({
        mutationFn: (dto) => crearSolicitudMedidorExtraJuridica(dto),
        onSuccess: async () => {
            await invalidarCachesRelacionadas(queryClient);
            showSuccess(
                'Solicitud enviada',
                'La solicitud de medidor extra (jurídica) fue registrada correctamente'
            );
        },
        onError: (error) => {
            const errorMessage =
                error?.response?.data?.message ||
                'No se pudo registrar la solicitud de medidor extra (jurídica).';
            showError('Error al enviar solicitud', errorMessage);
        },
    });
};

export const useSolicitudesMedidorExtraPorIdentificacion = (
    identificacion?: string,
    enabled: boolean = true
) => {
    return useQuery<SolicitudMedidorExtraItem[], Error>({
        queryKey: ['solicitudes-medidor-extra', 'identificacion', identificacion],
        queryFn: () => getSolicitudesMedidorExtraPorIdentificacion(identificacion as string),
        enabled: enabled && !!identificacion,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};
