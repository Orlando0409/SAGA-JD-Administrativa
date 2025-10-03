

import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { ServiceSolicitudCambioMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceCambioMedidor';
import { ServiceSolicitudCambioMedidorJuridicas } from '../../Service/EstadoSolicitudesJuridicas/ServiceSolicitudCambioMedidorJuridico';

export const useMutateEstadoSolicitudCambioMedidorJuridicas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudCambioMedidorJuridicas.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-cambio-medidor-juridica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-cambio-medidor-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Estado de cambio medidor jurídico actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess cambio medidor jurídico:', error);
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
export const useAprobarSolicitudCambioMedidorJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudCambioMedidorJuridicas.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-cambio-medidor-juridica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-cambio-medidor-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Solicitud de cambio medidor jurídica aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess aprobación cambio medidor jurídico:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al aprobar solicitud de cambio de medidor:', error);
        },
    });
};

/**
 * Hook específico para rechazar solicitudes de cambio de medidor
 */
export const useRechazarSolicitudCambioMedidorJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudCambioMedidorJuridicas.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-cambio-medidor-juridica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-cambio-medidor-juridica'] 
            });

            console.log(' Solicitud de cambio de medidor rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error(' Error al rechazar solicitud de cambio de medidor:', error);
        },
    });
};