import { useQuery } from '@tanstack/react-query';
import { SolicitudesFisicasService } from '../Service/SolicitudesFisicas';
import type { SolicitudFisica } from '../Models/ModelosFisicas';

/**
 * 🎣 Hook para gestionar solicitudes físicas
 * Utiliza React Query para cache y gestión de estado
 */

/**
 * 📥 Hook para obtener todas las solicitudes físicas
 * @returns UseQueryResult con las solicitudes físicas
 */
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

/**
 * 📥 Hook para obtener solicitudes físicas pendientes (usa cache cuando es posible)
 * @returns UseQueryResult con las solicitudes físicas pendientes
 */
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

/**
 * 🔄 Hook personalizable para filtrar solicitudes físicas por estado
 * @param estado - Estado a filtrar
 * @param enabled - Si el query debe ejecutarse
 * @returns UseQueryResult con las solicitudes filtradas
 */
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

/**
 * 🔄 Hook personalizable para filtrar solicitudes físicas por tipo
 * @param tipo - Tipo de solicitud a filtrar
 * @param enabled - Si el query debe ejecutarse
 * @returns UseQueryResult con las solicitudes filtradas
 */
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

// 🎯 Hooks específicos por tipo (para conveniencia)

export const useSolicitudesFisicasAfiliacion = () => {
    return useSolicitudesFisicasPorTipo('Afiliacion');
};

/**
 * 📥 Hook para obtener solicitudes de desconexión físicas
 */
export const useSolicitudesFisicasDesconexion = () => {
    return useSolicitudesFisicasPorTipo('Desconexion');
};

/**
 * 📥 Hook para obtener solicitudes de cambio de medidor físicas
 */
export const useSolicitudesFisicasCambioMedidor = () => {
    return useSolicitudesFisicasPorTipo('Cambio de Medidor');
};

/**
 * 📥 Hook para obtener solicitudes de asociado físicas
 */
export const useSolicitudesFisicasAsociado = () => {
    return useSolicitudesFisicasPorTipo('Asociado');
};
