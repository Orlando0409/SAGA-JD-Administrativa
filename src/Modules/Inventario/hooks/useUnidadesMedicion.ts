import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as UnidadesMedicionService from '../service/UnidadesMedicionService';
import type { CreateUnidadMedicionData, UpdateUnidadMedicionData } from '../models/Inventario';

// ========== HOOKS PARA UNIDADES DE MEDICIÓN ==========

// Query para obtener todas las unidades de medición
export const useGetAllUnidadesMedicion = () => {
  return useQuery({
    queryKey: ['unidades-medicion'],
    queryFn: UnidadesMedicionService.getAllUnidadesMedicion,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Query para obtener unidades de medición simples
export const useGetAllUnidadesMedicionSimple = () => {
  return useQuery({
    queryKey: ['unidades-medicion', 'simple'],
    queryFn: UnidadesMedicionService.getAllUnidadesMedicionSimple,
    staleTime: 1000 * 60 * 10, // 10 minutos (datos más estables)
    refetchOnWindowFocus: false,
  });
};

// Query para obtener una unidad de medición por ID
export const useGetUnidadMedicionById = (id: number) => {
  return useQuery({
    queryKey: ['unidad-medicion', id],
    queryFn: () => UnidadesMedicionService.getUnidadMedicionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation para crear unidad de medición
export const useCreateUnidadMedicion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUnidadMedicionData) => UnidadesMedicionService.createUnidadMedicion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
    },
    onError: (error: any) => {
      console.error('Error al crear la unidad de medición:', error);
    },
  });
};

// Mutation para actualizar unidad de medición
export const useUpdateUnidadMedicion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUnidadMedicionData }) => 
      UnidadesMedicionService.updateUnidadMedicion(id, data),
    onSuccess: (updatedUnidad) => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidad-medicion', updatedUnidad.Id_Unidad_Medicion] });
    },
    onError: (error: any) => {
      console.error('Error al actualizar la unidad de medición:', error);
    },
  });
};

// Mutation para actualizar estado de unidad de medición
export const useUpdateEstadoUnidadMedicion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ unidadId, estadoId }: { unidadId: number; estadoId: number }) => 
      UnidadesMedicionService.updateEstadoUnidadMedicion(unidadId, estadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
    },
    onError: (error: any) => {
      console.error('Error al actualizar el estado de la unidad de medición:', error);
    },
  });
};

// Mutation para eliminar unidad de medición
export const useDeleteUnidadMedicion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => UnidadesMedicionService.deleteUnidadMedicion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
    },
    onError: (error: any) => {
      console.error('Error al eliminar la unidad de medición:', error);
    },
  });
};