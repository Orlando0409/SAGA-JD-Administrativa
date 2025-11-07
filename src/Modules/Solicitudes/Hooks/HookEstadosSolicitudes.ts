import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServiceEstadoSolicitudes } from "../Service/EstadoSolicitudes";
import type { TipoSolicitud, TipoPersona, EstadoSolicitud } from "../Types/EstadoSolicitudes";
import { useAlerts } from "@/Modules/Global/context/AlertContext";

/**
 * 🎯 Hook Unificado para manejo de estados de solicitudes
 * 
 * Centraliza toda la lógica de React Query para cambios de estado
 * Reemplaza a los 16+ hooks individuales anteriores
 */

// ============================================
// 🔄 Hook Genérico Base
// ============================================

interface CambiarEstadoParams {
    tipoSolicitud: TipoSolicitud;
    tipoPersona: TipoPersona;
    solicitudId: number | string;
    nuevoEstado: EstadoSolicitud;
}

/**
 * Hook genérico para cambiar el estado de cualquier solicitud
 * Maneja la invalidación automática de cachés y muestra alertas
 */
export const useCambiarEstadoSolicitud = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    return useMutation({
        mutationFn: (params: CambiarEstadoParams) =>
            ServiceEstadoSolicitudes.cambiarEstado(params),

        onSuccess: async (_, variables) => {
            const emoji = variables.tipoPersona === 'fisica' ? '👤' : '🏢';
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
            
            console.log(`✅ ${emoji} Hook: Estado cambiado exitosamente`, variables);

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

            console.log(`🔄 ${emoji} Cachés invalidadas y actualizadas`);
            
            // Mostrar alerta de éxito
            showSuccess(titulo, mensaje);
        },

        onError: (error: any, variables) => {
            const emoji = variables.tipoPersona === 'fisica' ? '👤' : '🏢';
            const tipoPersonaTexto = variables.tipoPersona === 'fisica' ? 'Física' : 'Jurídica';
            
            console.error(`❌ ${emoji} Hook: Error al cambiar estado`, error, variables);
            
            const errorMessage = error?.response?.data?.message || 
                                `Error al actualizar el estado de la solicitud ${variables.tipoSolicitud} (${tipoPersonaTexto})`;
            
            showError('Error al cambiar estado', errorMessage);
        },
    });
};

// ============================================
// 🎁 Hooks de Conveniencia
// ============================================

/**
 * Hook para marcar solicitud como "En Revisión" (Estado 1 → 2)
 * 
 * @example
 * const marcarEnRevision = useMarcarEnRevision();
 * await marcarEnRevision.mutateAsync('afiliacion', 'fisica', 123);
 */
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

/**
 * Hook para aprobar y poner en espera (Estado 2 → 3)
 * 
 * @example
 * const aprobarYEnEspera = useAprobarYEnEspera();
 * await aprobarYEnEspera.mutateAsync('afiliacion', 'fisica', 123);
 */
export const useAprobarYEnEspera = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 3 }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 3 }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};

/**
 * Hook para completar solicitud (Estado 3 → 4)
 * 
 * @example
 * const completar = useCompletar();
 * await completar.mutateAsync('afiliacion', 'fisica', 123);
 */
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

/**
 * Hook para rechazar solicitud (Cualquier estado → 5)
 * 
 * @example
 * const rechazar = useRechazar();
 * await rechazar.mutateAsync('afiliacion', 'fisica', 123);
 */
export const useRechazar = () => {
    const cambiarEstado = useCambiarEstadoSolicitud();

    return {
        mutate: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutate({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 5 }),

        mutateAsync: (tipoSolicitud: TipoSolicitud, tipoPersona: TipoPersona, solicitudId: number | string) =>
            cambiarEstado.mutateAsync({ tipoSolicitud, tipoPersona, solicitudId, nuevoEstado: 5 }),

        isPending: cambiarEstado.isPending,
        isError: cambiarEstado.isError,
        isSuccess: cambiarEstado.isSuccess,
        error: cambiarEstado.error,
        data: cambiarEstado.data,
        reset: cambiarEstado.reset,
    };
};

// ============================================
// 🚀 Hook Compuesto para Flujo Completo
// ============================================

/**
 * Hook que proporciona todos los métodos de cambio de estado en un solo objeto
 * Útil cuando necesitas múltiples operaciones en el mismo componente
 * 
 * @example
 * const estadoSolicitud = useEstadoSolicitud();
 * 
 * // Marcar en revisión
 * await estadoSolicitud.marcarEnRevision('afiliacion', 'fisica', 123);
 * 
 * // Aprobar y en espera
 * await estadoSolicitud.aprobarYEnEspera('afiliacion', 'fisica', 123);
 * 
 * // Completar
 * await estadoSolicitud.completar('afiliacion', 'fisica', 123);
 * 
 * // Rechazar
 * await estadoSolicitud.rechazar('afiliacion', 'fisica', 123);
 * 
 * // Verificar si alguna operación está en curso
 * const cargando = estadoSolicitud.isLoading;
 */
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
