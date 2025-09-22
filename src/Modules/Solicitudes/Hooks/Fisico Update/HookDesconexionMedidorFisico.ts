import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudDesconexionMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudDesconexion';

/**
 * 🎣 Hook para actualizar estado de solicitudes de desconexión físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudDesconexion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudDesconexionMedidor.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            // 1. Actualizar la caché de la solicitud individual
            queryClient.setQueryData(
                ['solicitud-desconexion-fisica', { id: variables.solicitudId }], 
                data
            );

            // 2. Invalidar y refrescar la lista completa de solicitudes de desconexión
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-desconexion-fisica'] 
            });

            console.log('✅ Estado de desconexión actualizado exitosamente en caché:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al actualizar estado de desconexión:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes de desconexión
 */
export const useAprobarSolicitudDesconexion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudDesconexionMedidor.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-desconexion-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-desconexion-fisica'] 
            });

            console.log('✅ Solicitud de desconexión aprobada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud de desconexión:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes de desconexión
 */
export const useRechazarSolicitudDesconexion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudDesconexionMedidor.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-desconexion-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-desconexion-fisica'] 
            });

            console.log('✅ Solicitud de desconexión rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al rechazar solicitud de desconexión:', error);
        },
    });
};