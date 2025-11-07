import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServiceSolicitudAfiliacionFisica } from '../../Service/EstadoSolicitudesFisicas/ServiceSolicitudAfiliacion';

export const useMutateEstadoSolicitudAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ solicitudId, nuevoEstadoId }: {
            solicitudId: string | number;
            nuevoEstadoId: string | number;
        }) => {
            return ServiceSolicitudAfiliacionFisica.updateEstado(solicitudId, nuevoEstadoId);
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

export const useEnRevisionSolicitudAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionFisica.EnRevision(solicitudId);
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

export const useAprobarEnEsperaSolicitudAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionFisica.AprobarYEnEspera(solicitudId);
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

export const useCompletarSolicitudAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionFisica.Completado(solicitudId);
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

export const useRechazarSolicitudAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (solicitudId: string | number) => {
            return ServiceSolicitudAfiliacionFisica.Rechazar(solicitudId);
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