import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getAllMedidores,
  getMedidoresNoInstalados,
  getMedidoresInstalados,
  getMedidoresAveriados,
  getMedidoresAfiliado,
  createMedidor,
  asignarMedidorAAfiliado,
  updateEstadoMedidor
} from '../service/MaterialService';
import type { CreateMedidorData, AsignarMedidorData } from '../models/Inventario';


// Hook para obtener todos los medidores
export const useMedidores = () => {
  return useQuery({
    queryKey: ['medidores'],
    queryFn: getAllMedidores,
  });
};

// Hook para obtener medidores por estado
export const useMedidoresPorEstado = (estado: 'no-instalados' | 'instalados' | 'averiados') => {
  const queryFn = 
    estado === 'no-instalados' ? getMedidoresNoInstalados :
    estado === 'instalados' ? getMedidoresInstalados :
    getMedidoresAveriados;

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
    },
  });
};

// Hook para asignar medidor a afiliado
export const useAsignarMedidor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AsignarMedidorData) => asignarMedidorAAfiliado(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
    },
    onError: () => {
        console.error('Error al asignar el medidor');
    },
  });
};

// Hook para actualizar estado del medidor
export const useUpdateEstadoMedidor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idMedidor, idEstado }: { idMedidor: number; idEstado: number }) =>
      updateEstadoMedidor(idMedidor, idEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medidores'] });
    },
    onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el estado del medidor';
        console.error(errorMessage);
    },
  });
};
