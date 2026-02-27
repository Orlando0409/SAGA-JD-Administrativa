import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateMedidorData } from '../models/Medidor';
import {
  getAllMedidores,
  getMedidoresDisponibles,
  getMedidoresNoInstalados,
  getMedidoresInstalados,
  getMedidoresAveriados,
  getMedidoresAfiliado,
  createMedidor,
  updateEstadoMedidor,
  asignarMedidorAAfiliado,
} from '../service/MedidorServices';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

// Hook para obtener todos los medidores
export const useMedidores = () => {
  return useQuery({
    queryKey: ['medidores'],
    queryFn: getAllMedidores,
  });
};

// Hook para obtener medidores disponibles
export const useMedidoresDisponibles = () => {
  return useQuery({
    queryKey: ['medidores', 'disponibles'],
    queryFn: getMedidoresDisponibles,
  });
};

// Hook para obtener medidores por estado
export const useMedidoresPorEstado = (estado: 'no-instalados' | 'instalados' | 'averiados') => {
  let queryFn;
  if (estado === 'no-instalados') {
    queryFn = getMedidoresNoInstalados;
  } else if (estado === 'instalados') {
    queryFn = getMedidoresInstalados;
  } else {
    queryFn = getMedidoresAveriados;
  }

  return useQuery({
    queryKey: ['medidores', estado],
    queryFn,
  });
};

// Hook para obtener medidores de un afiliado
export const useMedidoresAfiliado = (idAfiliado: number) => {
  return useQuery({
    queryKey: ['medidores', 'afiliado', idAfiliado],
    queryFn: () => getMedidoresAfiliado(idAfiliado),
    enabled: !!idAfiliado,
  });
};

// Hook para crear medidor
export const useCreateMedidor = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ data }: { data: CreateMedidorData }) =>
      createMedidor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
      showSuccess('Éxito', 'Medidor creado correctamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el medidor';
      showError('Error', errorMessage);
    },
  });
};

// Hook para asignar medidor a afiliado
export const useAsignarMedidorAfiliado = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ idMedidor, idAfiliado }: { idMedidor: number; idAfiliado: number }) =>
      asignarMedidorAAfiliado(idMedidor, idAfiliado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
      showSuccess('Éxito', 'Medidor asignado al afiliado correctamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al asignar el medidor';
      showError('Error', errorMessage);
    },
  });
};

// Hook para actualizar estado del medidor
export const useUpdateEstadoMedidor = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ idMedidor, idEstado }: { idMedidor: number; idEstado: number }) =>
      updateEstadoMedidor(idMedidor, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
      showSuccess('Éxito', 'Estado del medidor actualizado correctamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar el estado del medidor';
      showError('Error', errorMessage);
    },
  });
};
