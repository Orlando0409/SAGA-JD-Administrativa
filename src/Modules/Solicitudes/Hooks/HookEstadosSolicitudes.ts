import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceEstadoSolicitudes } from "../Service/EstadoSolicitudes";
import type { TipoSolicitud, TipoPersona, EstadoSolicitud, OcupaPagarMedidor } from "../Types/EstadoSolicitudes";
import { useAlerts } from "@/Modules/Global/context/AlertContext";


interface CambiarEstadoParams {
    tipoSolicitud: TipoSolicitud;
    tipoPersona: TipoPersona;
    solicitudId: number | string;
    nuevoEstado: EstadoSolicitud;
    motivoRechazo?: string;
    ocupaPagarMedidor?: OcupaPagarMedidor;
}


export const useCambiarEstadoSolicitud = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    return useMutation({
        mutationFn: (params: CambiarEstadoParams) =>
            ServiceEstadoSolicitudes.cambiarEstado(params),

        onSuccess: async (_, variables) => {
        
            const tipoPersonaTexto = variables.tipoPersona === 'fisica' ? 'Física' : 'Jurídica';

            // Determinar el mensaje según el estado
            let titulo = 'Estado actualizado';
            let mensaje = '';

            switch (variables.nuevoEstado) {
                case 2:
                    titulo = 'En Revisión';
                    mensaje = `La solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto}) ha sido marcada como "En Revisión"`;
                    break;
                case 3:
                    titulo = 'Aprobada y en Espera';
                    mensaje = `La solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto}) ha sido aprobada y está en espera`;
                    break;
                case 4:
                    titulo = 'Solicitud Completada';
                    mensaje = `La solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto}) ha sido completada exitosamente`;
                    break;
                case 5:
                    titulo = 'Solicitud Rechazada';
                    mensaje = `La solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto}) ha sido rechazada`;
                    break;
                default:
                    mensaje = `Estado actualizado para solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto})`;
            }

            // Invalidar y refrescar todas las cachés relevantes
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["solicitudes-fisicas"] }),
                queryClient.invalidateQueries({ queryKey: ["solicitudes-juridicas"] }),
                queryClient.invalidateQueries({ queryKey: ["solicitud", variables.solicitudId] }),
                queryClient.refetchQueries({
                    queryKey: ["solicitudes-fisicas"],
                    type: 'active'
                }),
                queryClient.refetchQueries({
                    queryKey: ["solicitudes-juridicas"],
                    type: 'active'
                }),
            ]);

            // Mostrar alerta de éxito
            showSuccess(titulo, mensaje);
        },

        onError: (error: any, variables) => {
          
            const tipoPersonaTexto = variables.tipoPersona === 'fisica' ? 'Física' : 'Jurídica';

            const errorMessage = error?.response?.data?.message ||
                `Error al actualizar el estado de la solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto})`;

            showError('Error al cambiar estado', errorMessage);
        },
    });
};


export const useMarcarEnRevision = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 2 }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 2 }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};


export const useAprobarYEnEspera = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string, ocupaPagarMedidor?: OcupaPagarMedidor) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 3, ocupaPagarMedidor }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string, ocupaPagarMedidor?: OcupaPagarMedidor) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 3, ocupaPagarMedidor }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};


export const useCompletar = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 4 }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 4 }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};


export const useRechazar = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string, motivoRechazo?: string) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 5, motivoRechazo }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string, motivoRechazo?: string) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 5, motivoRechazo }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};


export const useEstadoSolicitud = () => {
    const marcarEnRevision = useMarcarEnRevision();
    const aprobarYEnEspera = useAprobarYEnEspera();
    const completar = useCompletar();
    const rechazar = useRechazar();

    return {
        // Métodos
        marcarEnRevision: marcarEnRevision.mutateAsync,
        aprobarYEnEspera: aprobarYEnEspera.mutateAsync,
        completar: completar.mutateAsync,
        rechazar: rechazar.mutateAsync,

        // Estados consolidados
        isLoading:
            marcarEnRevision.isPending ||
            aprobarYEnEspera.isPending ||
            completar.isPending ||
            rechazar.isPending,

        isError:
            marcarEnRevision.isError ||
            aprobarYEnEspera.isError ||
            completar.isError ||
            rechazar.isError,

        isSuccess:
            marcarEnRevision.isSuccess ||
            aprobarYEnEspera.isSuccess ||
            completar.isSuccess ||
            rechazar.isSuccess,

        // Acceso a estados individuales (si se necesitan)
        estados: {
            marcarEnRevision: {
                isPending: marcarEnRevision.isPending,
                isError: marcarEnRevision.isError,
                isSuccess: marcarEnRevision.isSuccess,
            },
            aprobarYEnEspera: {
                isPending: aprobarYEnEspera.isPending,
                isError: aprobarYEnEspera.isError,
                isSuccess: aprobarYEnEspera.isSuccess,
            },
            completar: {
                isPending: completar.isPending,
                isError: completar.isError,
                isSuccess: completar.isSuccess,
            },
            rechazar: {
                isPending: rechazar.isPending,
                isError: rechazar.isError,
                isSuccess: rechazar.isSuccess,
            },
        },
    };
};
