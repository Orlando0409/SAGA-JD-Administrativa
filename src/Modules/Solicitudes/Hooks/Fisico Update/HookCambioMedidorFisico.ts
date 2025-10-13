

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudCambioMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceCambioMedidor';

/**
 * 🎣 Hook para actualizar estado de solicitudes de cambio de medidor físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudCambioMedidor = () => {
    const queryClient = useQueryClient();



    
    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudCambioMedidor.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-cambio-medidor-fisica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-cambio-medidor-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });

                console.log('✅ Estado de cambio de medidor actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de cambio medidor:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al actualizar estado de cambio de medidor:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes de cambio de medidor
 */
export const useAprobarSolicitudCambioMedidor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudCambioMedidor.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-cambio-medidor-fisica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-cambio-medidor-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });

                console.log('✅ Solicitud de cambio de medidor aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de aprobación cambio medidor:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud de cambio de medidor:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes de cambio de medidor
 */
export const useRechazarSolicitudCambioMedidor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudCambioMedidor.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-cambio-medidor-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-cambio-medidor-fisicas'] 
            });

            console.log(' Solicitud de cambio de medidor rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error(' Error al rechazar solicitud de cambio de medidor:', error);
        },
    });
};