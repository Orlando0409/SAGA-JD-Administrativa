import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as CategoriasService from '../service/CategoriasService';
import type { CreateCategoriaMaterialData, UpdateCategoriaMaterialData } from '../models/Inventario';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: CategoriasService.getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoriasActivas = () => {
  return useQuery({
    queryKey: ['categories', 'activas'],
    queryFn: CategoriasService.getCategoriasActivas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoriasInactivas = () => {
  return useQuery({
    queryKey: ['categories', 'inactivas'],
    queryFn: CategoriasService.getCategoriasInactivas,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoriaById = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => CategoriasService.getCategoriaById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ data, idUsuario }: { data: CreateCategoriaMaterialData; idUsuario: number }) => 
      CategoriasService.createCategoria(data, idUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
        showSuccess('Categoría creada', 'La categoría se ha creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear la categoría';
      showError('Error', errorMessage);
    },
  });
};

export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, idUsuario, data }: { id: number; idUsuario: number; data: UpdateCategoriaMaterialData }) => 
      CategoriasService.updateCategoria(id, idUsuario, data),
    onSuccess: (updatedCategoria) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', updatedCategoria.Id_Categoria] });
      showSuccess('Categoría actualizada', 'La categoría se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar la categoría';
      showError('Error', errorMessage);
    },
  });
};


export const useUpdateEstadoCategoria = () => {
  const queryClient = useQueryClient();
  const { showSuccessWithUndo, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ id, nuevoEstado, idUsuario }: { id: number; nuevoEstado: number; idUsuario: number }) =>
      CategoriasService.updateEstadoCategoria(id, nuevoEstado, idUsuario),
    onSuccess: (_, { id, nuevoEstado, idUsuario }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      const accion = nuevoEstado === 1 ? 'activada' : 'desactivada';
      const estadoAnterior = nuevoEstado === 1 ? 2 : 1;
      
      const undoAction = async () => {
        try {
          await CategoriasService.updateEstadoCategoria(id, estadoAnterior, idUsuario);
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        } catch (error) {
          showError('Error', 'No se pudo revertir el cambio');
          console.error('Error reverting category state in undo action:', error);
        }
      };

      showSuccessWithUndo(
        `Categoría ${accion}`, 
        `La categoría se ha ${accion} exitosamente`,
        undoAction
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el estado de la categoría';
      showError('Error', errorMessage);
    },
  });
};