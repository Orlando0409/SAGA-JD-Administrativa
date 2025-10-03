import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { ServiceSolicitudDesconexionMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudDesconexion';
import { ServiceSolicitudAsociado } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudAsociado';

/**
 * 🎣 Hook para actualizar estado de solicitudes de desconexión físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudAsociado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: { 
            solicitudId: string | number; 
            nuevoEstadoId: string | number; 
        }) => {
            return ServiceSolicitudAsociado.updateEstado(solicitudId, nuevoEstadoId);
        },
        onSuccess: (data, variables) => {
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-asociado-fisica', { id: variables.solicitudId }], 
                    data
                );

                // 2. Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-asociado-fisica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });

                console.log('✅ Estado de asociado actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de asociado:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al actualizar estado de asociado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes de desconexión
 */
export const useAprobarSolicitudAsociado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAsociado.aprobar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché individual
                queryClient.setQueryData(
                    ['solicitud-asociado-fisica', { id: solicitudId }], 
                    data
                );
                
                // Cross-invalidation
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitud-asociado-fisica'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-fisicas'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['solicitudes-juridicas'] 
                });

                console.log('✅ Solicitud de asociado aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de aprobación asociado:', error);
            }
        },
        onError: (error: any) => {
            console.error(' Error al aprobar solicitud de asociado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes de desconexión
 */
export const useRechazarSolicitudAsociado = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAsociado.rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            // Actualizar cachés
            queryClient.setQueryData(
                ['solicitud-asociado-fisica', { id: solicitudId }], 
                data
            );
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-asociado-fisica'] 
            });

            console.log('✅ Solicitud de asociado rechazada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error(' Error al rechazar solicitud de asociado:', error);
        },
    });
};