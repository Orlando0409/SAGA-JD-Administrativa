import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateMedidorData } from '../models/Medidor';
import { getAllMedidores, getMedidoresNoInstalados, getMedidoresInstalados, getMedidoresAveriados, getMedidoresAfiliado, createMedidor, updateEstadoMedidor } from '../service/MedidorServices';

// Hook para obtener todos los medidores
export const useMedidores = () => {
  return useQuery({
    queryKey: ['medidores'],
    queryFn: getAllMedidores,
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

  return useMutation({
    mutationFn: ({ data, idUsuario }: { data: CreateMedidorData; idUsuario: number }) =>
      createMedidor(data, idUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al crear el medidor';
        console.error(errorMessage);
    },
  });
};

// Hook para actualizar estado del medidor
export const useUpdateEstadoMedidor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idMedidor, idEstado, idUsuario }: { idMedidor: number; idEstado: number; idUsuario: number }) =>
      updateEstadoMedidor(idMedidor, idEstado, idUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
    },
    onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el estado del medidor';
        console.error(errorMessage);
    },
  });
};
