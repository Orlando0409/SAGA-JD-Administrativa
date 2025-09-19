import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudAfiliacion } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudAfiliacion';

/**
 * 🎣 Hook para actualizar estado de solicitudes físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitud = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudAfiliacion.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            // 1. Actualizar la caché de la solicitud individual
            queryClient.setQueryData(
                ['solicitud-fisica', { id: variables.solicitudId }], 
                data
            );

            // 2. Invalidar y refrescar la lista completa de solicitudes
            queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-fisicas'] 
            });

            console.log('✅ Estado actualizado exitosamente en caché:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al actualizar estado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes
 */
export const useAprobarSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-fisicas'] 
            });

            console.log('✅ Solicitud aprobada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes
 */
export const useRechazarSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-fisicas'] 
            });

            console.log('✅ Solicitud rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al rechazar solicitud:', error);
        },
    });
};