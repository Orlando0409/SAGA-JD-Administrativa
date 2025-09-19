
import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { ServiceSolicitudDesconexionMedidor } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudDesconexion';
//import { ServiceSolicitudAsociado } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudAsociado';
import { ServiceSolicitudAfiliacionJuridicas } from '../../Service/EstadoSolicitudesJuridicas/ServiceSolicitudAfiliacionJuridica';

/**
 * 🎣 Hook para actualizar estado de solicitudes de desconexión físicas
 * Basado en el patrón useMutation de React Query
 */
export const useMutateEstadoSolicitudAsociadoJuridico = () => {
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
                ['solicitud-asociado-juridica', { id: variables.solicitudId }], 
                data
            );

            // 2. Invalidar y refrescar la lista completa de solicitudes de asociado
            queryClient.invalidateQueries({ 
                queryKey: ['solicitud-asociado-juridica'] 
            });

            console.log('✅ Estado de asociado actualizado exitosamente en caché:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al actualizar estado de asociado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para aprobar solicitudes de desconexión
 */
export const useAprobarSolicitudAsociadoJuridico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionJuridicas.aprobar(solicitudId);
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

            console.log('✅ Solicitud de asociado aprobada exitosamente:', data);
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud de asociado:', error);
        },
    });
};

/**
 * 🎣 Hook específico para rechazar solicitudes de desconexión
 */
export const useRechazarSolicitudAsociadoJuridico = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionJuridicas.rechazar(solicitudId);
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
            console.error('❌ Error al rechazar solicitud de asociado:', error);
        },
    });
};