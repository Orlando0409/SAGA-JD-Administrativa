import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SolicitudesFisicasService } from '../Service/SolicitudesFisicas';
import type { SolicitudFisica } from '../Models/ModelosFisicas';

/**
 * 🔄 Función para refrescar todas las consultas de solicitudes físicas
 * Útil para refresh manual después de operaciones CRUD
 */
export const useRefetchAllSolicitudesFisicas = () => {
    const queryClient = useQueryClient();
    
    const refetchAll = async () => {
        try {
            // Invalidar todas las queries relacionadas con solicitudes físicas
            await queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-fisicas'] 
            });
            
            // También invalidar solicitudes jurídicas para cross-invalidation
            await queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-juridicas'] 
            });
            
            console.log('✅ Todas las consultas de solicitudes físicas refrescadas');
        } catch (error) {
            console.error('❌ Error al refrescar consultas de solicitudes físicas:', error);
        }
    };
    
    return { refetchAll };
};

export const useSolicitudesFisicas = () => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas'],
        queryFn: () => SolicitudesFisicasService.getSolicitudesFisicas(),
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
        queryFn: () => SolicitudesFisicasService.getSolicitudesPendientes(),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};


export const useSolicitudesFisicasPorEstado = (estado: string, enabled: boolean = true) => {
    return useQuery<SolicitudFisica[], Error>({
        queryKey: ['solicitudes-fisicas', 'estado', estado],
        queryFn: () => SolicitudesFisicasService.getSolicitudesPorEstado(estado),
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
        queryFn: () => SolicitudesFisicasService.getSolicitudesPorTipo(tipo),
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

/*
 *  Hook para obtener solicitudes de desconexión físicas
 */
export const useSolicitudesFisicasDesconexion = () => {
    return useSolicitudesFisicasPorTipo('Desconexion');
};

/**
 *  Hook para obtener solicitudes de cambio de medidor físicas
 */
export const useSolicitudesFisicasCambioMedidor = () => {
    return useSolicitudesFisicasPorTipo('Cambio de Medidor');
};

/**
 *  Hook para obtener solicitudes de asociado físicas
 */
export const useSolicitudesFisicasAsociado = () => {
    return useSolicitudesFisicasPorTipo('Asociado');
};
