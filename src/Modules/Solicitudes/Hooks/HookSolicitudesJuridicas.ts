import { useQuery } from '@tanstack/react-query';
import { SolicitudesJuridicasService } from '../Service/SolicitudesJuridicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';

/**
 * 🎣 Hook para gestionar solicitudes jurídicas
 * Utiliza React Query para cache y gestión de estado
 */

/**
 * 📥 Hook para obtener todas las solicitudes jurídicas
 * @returns UseQueryResult con las solicitudes jurídicas
 */
export const useSolicitudesJuridicas = () => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas'],
        queryFn: () => SolicitudesJuridicasService.getSolicitudesJuridicas(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos (antes cacheTime)
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};

/**
 * 📥 Hook para obtener solicitudes jurídicas pendientes (usa cache cuando es posible)
 * @returns UseQueryResult con las solicitudes jurídicas pendientes
 */
export const useSolicitudesJuridicasPendientes = () => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'pendientes'],
        queryFn: () => SolicitudesJuridicasService.getSolicitudesPendientes(),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

/**
 * 🔄 Hook personalizable para filtrar solicitudes jurídicas por estado
 * @param estado - Estado a filtrar
 * @param enabled - Si el query debe ejecutarse
 * @returns UseQueryResult con las solicitudes filtradas
 */
export const useSolicitudesJuridicasPorEstado = (estado: string, enabled: boolean = true) => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'estado', estado],
        queryFn: () => SolicitudesJuridicasService.getSolicitudesPorEstado(estado),
        enabled: enabled && !!estado,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

/**
 * 🔄 Hook personalizable para filtrar solicitudes jurídicas por tipo
 * @param tipo - Tipo de solicitud a filtrar
 * @param enabled - Si el query debe ejecutarse
 * @returns UseQueryResult con las solicitudes filtradas
 */
export const useSolicitudesJuridicasPorTipo = (
    tipo: 'Afiliacion' | 'Desconexion' | 'Cambio de Medidor' | 'Asociado',
    enabled: boolean = true
) => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'tipo', tipo],
        queryFn: () => SolicitudesJuridicasService.getSolicitudesPorTipo(tipo),
        enabled: enabled && !!tipo,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

// 🎯 Hooks específicos por tipo (para conveniencia)

export const useSolicitudesJuridicasAfiliacion = () => {
    return useSolicitudesJuridicasPorTipo('Afiliacion');
}

/**
 * 📥 Hook para obtener solicitudes de desconexión jurídicas
 */
export const useSolicitudesJuridicasDesconexion = () => {
    return useSolicitudesJuridicasPorTipo('Desconexion');
};

/**
 * 📥 Hook para obtener solicitudes de cambio de medidor jurídicas
 */
export const useSolicitudesJuridicasCambioMedidor = () => {
    return useSolicitudesJuridicasPorTipo('Cambio de Medidor');
};

/**
 * 📥 Hook para obtener solicitudes de asociado jurídicas
 */
export const useSolicitudesJuridicasAsociado = () => {
    return useSolicitudesJuridicasPorTipo('Asociado');
};
