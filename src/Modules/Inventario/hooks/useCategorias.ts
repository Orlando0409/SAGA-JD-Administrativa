import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as CategoriasService from '../service/CategoriasService';
import type { CreateCategoriaMaterialData, UpdateCategoriaMaterialData } from '../models/Inventario';

// ========== HOOKS PARA CATEGORÍAS ==========

// Query para obtener todas las categorías
export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: CategoriasService.getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Query para obtener una categoría por ID
export const useGetCategoriaById = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => CategoriasService.getCategoriaById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation para crear categoría
export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriaMaterialData) => CategoriasService.createCategoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: any) => {
      console.error('Error al crear la categoría:', error);
    },
  });
};

// Mutation para actualizar categoría
export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoriaMaterialData }) => 
      CategoriasService.updateCategoria(id, data),
    onSuccess: (updatedCategoria) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['category', updatedCategoria.Id_Categoria] });
    },
    onError: (error: any) => {
      console.error('Error al actualizar la categoría:', error);
    },
  });
};

// Mutation para eliminar categoría
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