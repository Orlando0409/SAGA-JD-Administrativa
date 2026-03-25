import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SolicitudFisica, SolicitudAgregarMedidorFisica } from '../Models/ModelosFisicas';
import { getSolicitudesFisicas, getSolicitudesPendientes, getSolicitudesPorEstado, getSolicitudesPorTipo, getSolicitudesAgregarMedidorFisicas } from '../Service/SolicitudesFisicas';


export const useRefetchAllSolicitudesFisicas = () => {
    const queryClient = useQueryClient();

    const refetchAll = async () => {
        try {
            // Invalidar todas las queries relacionadas con solicitudes físicas
            await queryClient.invalidateQueries({
                queryKey: ['solicitudes-fisicas']
            });

            // También invalidar solicitudes jurídicas
            await queryClient.invalidateQueries({
                queryKey: ['solicitudes-juridicas']
            });

        } catch (error) {
            console.error('Error al refrescar consultas de solicitudes físicas:', error);
        }
    };

    return { refetchAll };
};

export const useSolicitudesFisicas = () => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas'],
        queryFn: () => getSolicitudesFisicas(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos (antes cacheTime)
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

export const useSolicitudesFisicasPendientes = () => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas', 'pendientes'],
        queryFn: () => getSolicitudesPendientes(),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const useSolicitudesFisicasPorEstado = (estado: string, enabled: boolean = true) => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas', 'estado', estado],
        queryFn: () => getSolicitudesPorEstado(estado),
        enabled: enabled && !!estado,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

export const useSolicitudesFisicasPorTipo = (
    tipo: 'Afiliacion' | 'Desconexion' | 'Cambio de Medidor' | 'Asociado',
    enabled: boolean = true
) => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas', 'tipo', tipo],
        queryFn: () => getSolicitudesPorTipo(tipo),
        enabled: enabled && !!tipo,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

// Hooks específicos por tipo (para conveniencia)
export const useSolicitudesFisicasAfiliacion = () => {
    return useSolicitudesFisicasPorTipo('Afiliacion');
};


export const useSolicitudesFisicasDesconexion = () => {
    return useSolicitudesFisicasPorTipo('Desconexion');
};


export const useSolicitudesFisicasCambioMedidor = () => {
    return useSolicitudesFisicasPorTipo('Cambio de Medidor');
};


export const useSolicitudesFisicasAsociado = () => {
    return useSolicitudesFisicasPorTipo('Asociado');
};

export const useSolicitudesFisicasAgregarMedidor = () => {
    return useQuery<SolicitudAgregarMedidorFisica[], Error>({
        queryKey: ['solicitudes-fisicas', 'agregar-medidor'],
        queryFn: () => getSolicitudesAgregarMedidorFisicas(),
        staleTime: 3 * 60 * 1000,
        gcTime: 8 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
    });
};
