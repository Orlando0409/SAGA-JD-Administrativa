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
      let errorMessage = 'Error al enviar la respuesta';

      // Si es un error del servidor con mensaje
      if (err.response?.data?.message) {
        errorMessage = Array.isArray(err.response?.data?.message)
          ? err.response?.data?.message[0]
          : err.response?.data?.message;
      }
      // Otros errores incluyendo errores de validación ya procesados
      else if (err?.message) {
        errorMessage = err.message;
      }

      showError('Error', errorMessage);
    },
  });
}