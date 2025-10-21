import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { responderQueja, responderSugerencia, responderReporte, obtenerQuejas, obtenerSugerencias, obtenerReportes, actualizarEstadoReporte, actualizarEstadoSugerencia, actualizarEstadoQueja } from '../service/ContactoService';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { ContactoItem } from '../types/ContactoTypes';


export const useQuejas = () => {
  return useQuery({
    queryKey: ['quejas'],
    queryFn: () => obtenerQuejas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useSugerencias = () => {
  return useQuery({
    queryKey: ['sugerencias'],
    queryFn: () => obtenerSugerencias(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useReportes = () => {
  return useQuery({
    queryKey: ['reportes'],
    queryFn: () => obtenerReportes(),
    staleTime: 5 * 60 * 1000,
  });
};


export const useUpdateReporteEstado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, idEstado }: { id: number; idEstado: number }) =>
      actualizarEstadoReporte(id, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};

export const useUpdateSugerenciaEstado = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, idEstado }: { id: number; idEstado: number }) =>
      actualizarEstadoSugerencia(id, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
    },
  });
};

export const useUpdateQuejaEstado = () => {
  const queryClient = useQueryClient();   

  return useMutation({
    mutationFn: ({ id, idEstado }: { id: number; idEstado: number }) =>
      actualizarEstadoQueja(id, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quejas'] });
    },
  });
};


export function useResponderContacto(item: ContactoItem) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: async (respuesta: string) => {
      if (!respuesta.trim()) throw new Error('La respuesta no puede estar vacía');
      if (item.tipo === 'Queja') {
        return responderQueja(item.id, respuesta);
      } else if (item.tipo === 'Sugerencia') {
        return responderSugerencia(item.id, respuesta);
      } else if (item.tipo === 'Reporte') {
        return responderReporte(item.id, respuesta);
      }
      throw new Error('Tipo de contacto no soportado');
    },
    onSuccess: () => {
      // Actualizar la lista correspondiente
      if (item.tipo === 'Queja') queryClient.invalidateQueries({ queryKey: ['quejas'] });
      if (item.tipo === 'Sugerencia') queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
      if (item.tipo === 'Reporte') queryClient.invalidateQueries({ queryKey: ['reportes'] });
      showSuccess('Respuesta enviada', 'La respuesta se ha enviado exitosamente');
    },
    onError: (err: any) => {
      console.error('Error al responder el contacto:', err);
      showError('Error', err?.message);
    },
  });
}