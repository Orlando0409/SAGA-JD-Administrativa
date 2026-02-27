import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import { getSolicitudesJuridicas, getSolicitudesPendientes, getSolicitudesPorEstado, getSolicitudesPorTipo } from '../Service/SolicitudesJuridicas';


export const useRefetchAllSolicitudesJuridicas = () => {
    const queryClient = useQueryClient();

    const refetchAll = async () => {
        try {
            // Invalidar todas las queries relacionadas con solicitudes jurídicas
            await queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-juridicas'] 
            });
            
            // También invalidar solicitudes físicas para cross-invalidation
            await queryClient.invalidateQueries({ 
                queryKey: ['solicitudes-fisicas'] 
            });
            
            console.log('✅ Todas las consultas de solicitudes jurídicas refrescadas');
        } catch (error) {
            console.error('❌ Error al refrescar consultas de solicitudes jurídicas:', error);
        }
    };
    
    return { refetchAll };
};

export const useSolicitudesJuridicas = () => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas'],
        queryFn: () => getSolicitudesJuridicas(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos (antes cacheTime)
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
};


export const useSolicitudesJuridicasPendientes = () => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'pendientes'],
        queryFn: () => getSolicitudesPendientes(),
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

 //Hook personalizable para filtrar solicitudes jurídicas por estado

 
export const useSolicitudesJuridicasPorEstado = (estado: string, enabled: boolean = true) => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'estado', estado],
        queryFn: () =>  getSolicitudesPorEstado(estado),
        enabled: enabled && !!estado,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

  //Hook personalizable para filtrar solicitudes jurídicas por tipo

export const useSolicitudesJuridicasPorTipo = (
    tipo: 'Afiliacion' | 'Desconexion' | 'Cambio de Medidor' | 'Asociado',
    enabled: boolean = true
) => {
    return useQuery<SolicitudJuridica[], Error>({
        queryKey: ['solicitudes-juridicas', 'tipo', tipo],
        queryFn: () => getSolicitudesPorTipo(tipo),
        enabled: enabled && !!tipo,
        staleTime: 3 * 60 * 1000, // 3 minutos
        gcTime: 8 * 60 * 1000,    // 8 minutos
        refetchOnWindowFocus: false,
        retry: 2,
    });
};

//  Hooks específicos por tipo (para conveniencia)

export const useSolicitudesJuridicasAfiliacion = () => {
    return useSolicitudesJuridicasPorTipo('Afiliacion');
}


export const useSolicitudesJuridicasDesconexion = () => {
    return useSolicitudesJuridicasPorTipo('Desconexion');
};


export const useSolicitudesJuridicasCambioMedidor = () => {
    return useSolicitudesJuridicasPorTipo('Cambio de Medidor');
};


export const useSolicitudesJuridicasAsociado = () => {
    return useSolicitudesJuridicasPorTipo('Asociado');
};
