// src/Modules/QuejasSugerenciasReportes/hook/HookContacto.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  obtenerQuejas,
  obtenerSugerencias,
  obtenerReportes,
  crearQueja,
  crearSugerencia,
  crearReporte,
  actualizarEstadoReporte,
  eliminarQueja,
  eliminarSugerencia,
  eliminarReporte,
} from '../service/ContactoService';
import type { CreateQuejaData } from '../models/Quejas';
import type { CreateSugerenciaData } from '../models/Sugerencias';
import type { CreateReporteData } from '../models/Reportes';

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
export const useCreateQueja = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, adjunto }: { data: CreateQuejaData; adjunto?: File }) => crearQueja(data, adjunto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quejas'] });
    },
  });
};

export const useCreateSugerencia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, adjunto }: { data: CreateSugerenciaData; adjunto?: File }) => crearSugerencia(data, adjunto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
    },
  });
};

export const useCreateReporte = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, adjunto }: { data: CreateReporteData; adjunto?: File }) => crearReporte(data, adjunto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
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

export const useDeleteQueja = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => eliminarQueja(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quejas'] });
    },
  });
};

export const useDeleteSugerencia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => eliminarSugerencia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
    },
  });
};

export const useDeleteReporte = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => eliminarReporte(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
    },
  });
};