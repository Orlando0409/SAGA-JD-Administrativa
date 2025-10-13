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
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-juridica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-afiliacion-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Estado jurídico actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess jurídico:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al actualizar estado:', error);
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
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-juridica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-afiliacion-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Solicitud jurídica aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess aprobación jurídica:', error);
            }
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