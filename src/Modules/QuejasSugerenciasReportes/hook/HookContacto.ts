import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ContactoItem } from '../components/ContactoTable';
import { responderQueja, responderSugerencia, responderReporte, obtenerQuejas, obtenerSugerencias, obtenerReportes, actualizarEstadoReporte } from '../service/ContactoService';

export function useResponderContacto(item: ContactoItem) {
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const mutation = useMutation({
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
      setSuccessMsg('Respuesta enviada correctamente');
      setErrorMsg('');
      // Actualizar la lista correspondiente
      if (item.tipo === 'Queja') queryClient.invalidateQueries({ queryKey: ['quejas'] });
      if (item.tipo === 'Sugerencia') queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
      if (item.tipo === 'Reporte') queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || 'Error al enviar la respuesta');
      setSuccessMsg('');
    },
  });

  function sendRespuesta(respuesta: string, onSuccess?: () => void) {
    mutation.mutate(respuesta, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  }

  function resetFeedback() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  return {
    sendRespuesta,
    isLoading: mutation.isPending,
    errorMsg,
    successMsg,
    resetFeedback,
  };
}
// ======================== QUERIES ========================
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

// ======================== MUTATIONS ========================

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
