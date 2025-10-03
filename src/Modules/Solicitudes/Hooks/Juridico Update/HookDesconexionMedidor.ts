
import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { ServiceSolicitudDesconexionMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudDesconexion';
import { ServiceSolicitudDesconexionMedidorJuridicas } from '../../Service/EstadoSolicitudesJuridicas/ServiceSolitudDesconexion';

/**
 * 🎣 Hook para actualizar estado de solicitudes de desconexión físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudDesconexionJuridicas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudDesconexionMedidorJuridicas.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-desconexion-juridica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-desconexion-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Estado de desconexión jurídica actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess desconexión jurídica:', error);
            }
        },
        onError: (error: any) => {
            console.error('Error al actualizar estado de desconexión:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes de desconexión
 */
export const useAprobarSolicitudDesconexionJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudDesconexionMedidorJuridicas.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-desconexion-juridica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-desconexion-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Solicitud de desconexión jurídica aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess aprobación desconexión jurídica:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al aprobar solicitud de desconexión:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes de desconexión
 */
export const useRechazarSolicitudDesconexionJuridica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudDesconexionMedidorJuridicas.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-desconexion-juridica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-desconexion-juridica'] 
            });

            console.log(' Solicitud de desconexión rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error(' Error al rechazar solicitud de desconexión:', error);
        },
    });
};