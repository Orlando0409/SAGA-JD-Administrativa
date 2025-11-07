import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudAfiliacion } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudAfiliacion';

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
            try {
                // 1. Actualizar la caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-fisica', { id: variables.solicitudId }],
                    data
                );

                // 2. Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({
                    queryKey: ['solicitud-afiliacion-fisica']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-fisicas']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-juridicas']
                });

                console.log('✅ Estado actualizado exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess del estado:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al actualizar estado:', error);
        },
    });
};

export const useEnRevisionSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.EnRevision(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-fisica', { id: solicitudId }],
                    data
                );

                // Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({
                    queryKey: ['solicitud-afiliacion-fisica']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-fisicas']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-juridicas']
                });

                console.log('✅ Solicitud marcada como pendiente exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de marcar pendiente:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al marcar solicitud como pendiente:', error);
        },
    });
};

export const useAprobarEnEsperaSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.AprobarYEnEspera(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-fisica', { id: solicitudId }],
                    data
                );

                // Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({
                    queryKey: ['solicitud-afiliacion-fisica']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-fisicas']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-juridicas']
                });

                console.log('✅ Solicitud marcada en proceso exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de marcar en proceso:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al marcar solicitud en proceso:', error);
        },
    });
};

export const useCompletarSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.Completado(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-fisica', { id: solicitudId }],
                    data
                );

                // Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({
                    queryKey: ['solicitud-afiliacion-fisica']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-fisicas']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-juridicas']
                });

                console.log('✅ Solicitud aprobada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de aprobación:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al aprobar solicitud:', error);
        },
    });
};

export const useRechazarSolicitudAfiliacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacion.Rechazar(solicitudId);
        },
        onSuccess: (data, solicitudId) => {
            try {
                // Actualizar caché de la solicitud individual
                queryClient.setQueryData(
                    ['solicitud-afiliacion-fisica', { id: solicitudId }],
                    data
                );

                // Cross-invalidation: invalidar todas las consultas relacionadas
                queryClient.invalidateQueries({
                    queryKey: ['solicitud-afiliacion-fisica']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-fisicas']
                });
                queryClient.invalidateQueries({
                    queryKey: ['solicitudes-juridicas']
                });

                console.log('✅ Solicitud rechazada exitosamente con cross-invalidation:', data);
            } catch (error) {
                console.error('❌ Error en onSuccess de rechazo:', error);
            }
        },
        onError: (error: any) => {
            console.error('❌ Error al rechazar solicitud:', error);
        },
    });
};