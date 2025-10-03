
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudAsociadoJuridicas } from '../../Service/EstadoSolicitudesJuridicas/ServiceSolicitudAsociado';

//actualizar 
export const useMutateEstadoSolicitudAsociadoJuridico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudAsociadoJuridicas.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-asociado-juridica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-asociado-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Estado de asociado jurídico actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess asociado jurídico:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al actualizar estado de asociado:', error);
        },
    });
};


 // Hook específico para aprobar solicitudes de desconexión
 
export const useAprobarSolicitudAsociadoJuridico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAsociadoJuridicas.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-asociado-juridica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-asociado-juridica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });

                console.log('✅ Solicitud de asociado jurídica aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess aprobación asociado jurídico:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al aprobar solicitud de asociado:', error);
        },
    });
};

/**
 * Hook específico para rechazar solicitudes de desconexión
 */
export const useRechazarSolicitudAsociadoJuridico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAsociadoJuridicas.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-asociado-juridica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-asociado-juridica'] 
            });

            console.log('✅ Solicitud de asociado rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error(' Error al rechazar solicitud de asociado:', error);
        },
    });
};