import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudAfiliacionJuridicas } from '../../Service/EstadoSolicitudesJuridicas/ServiceSolicitudAfiliacionJuridica';

/**
 * 🎣 Hook para actualizar estado de solicitudes jurídicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudAfiliacionJuridicas.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            // 1. Actualizar la caché de la solicitud individual
            queryClient.setQueryData(
                ['solicitud-afiliacion-juridica', { id: variables.solicitudId }], 
                data
            );

            // 2. Invalidar y refrescar la lista completa de solicitudes
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-afiliacion-juridica'] 
            });

            console.log('✅ Estado actualizado exitosamente en caché:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al actualizar estado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes jurídicas
 */
export const useAprobarSolicitudAfiliacionJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionJuridicas.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-afiliacion-juridica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-afiliacion-juridica'] 
            });

            console.log('✅ Solicitud jurídica aprobada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud jurídica:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes jurídicas
 */
export const useRechazarSolicitudAfiliacionJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionJuridicas.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-afiliacion-juridica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-afiliacion-juridica'] 
            });

            console.log('✅ Solicitud jurídica rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al rechazar solicitud jurídica:', error);
        },
    });
};