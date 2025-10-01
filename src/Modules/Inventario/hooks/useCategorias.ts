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
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoriaMaterialData }) => 
      CategoriasService.updateCategoria(id, data),
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

export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CategoriasService.deleteCategoria(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      console.error('Error al eliminar la categoría:', error);
    },
  });
};

export const useUpdateEstadoCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: number; nuevoEstado: number }) =>
      CategoriasService.updateEstadoCategoria(id, nuevoEstado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      console.error('Error al actualizar el estado de la categoría');
    },
  });
};