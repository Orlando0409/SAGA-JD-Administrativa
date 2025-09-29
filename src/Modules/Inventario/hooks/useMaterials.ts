import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as MaterialService from '../service/MaterialService';
import type { CreateMaterialData, UpdateMaterialData } from '../models/Inventario';

// ========== HOOKS PARA MATERIALES ==========

// Query para obtener todos los materiales
export const useGetAllMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: MaterialService.getAllMaterials,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Query para obtener un material por ID
export const useGetMaterialById = (id: number) => {
  return useQuery({
    queryKey: ['material', id],
    queryFn: () => MaterialService.getMaterialById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Query para materiales con categorías
export const useGetMaterialesConCategorias = () => {
  return useQuery({
    queryKey: ['materials', 'with-categories'],
    queryFn: MaterialService.getMaterialesConCategorias,
    staleTime: 1000 * 60 * 5,
  });
};

// Query para materiales sin categorías
export const useGetMaterialesSinCategorias = () => {
  return useQuery({
    queryKey: ['materials', 'without-categories'],
    queryFn: MaterialService.getMaterialesSinCategorias,
    staleTime: 1000 * 60 * 5,
  });
};

// Query para materiales por encima de stock
export const useGetMaterialesPorEncimaDeStock = (threshold: number) => {
  return useQuery({
    queryKey: ['materials', 'above-stock', threshold],
    queryFn: () => MaterialService.getMaterialesPorEncimaDeStock(threshold),
    enabled: threshold > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Query para materiales por debajo de stock
export const useGetMaterialesPorDebajoDeStock = (threshold: number) => {
  return useQuery({
    queryKey: ['materials', 'below-stock', threshold],
    queryFn: () => MaterialService.getMaterialesPorDebajoDeStock(threshold),
    enabled: threshold > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Mutation para crear material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialData) => MaterialService.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error: any) => {
      console.error('Error al crear el material:', error);
    },
  });
};

// Mutation para actualizar material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMaterialData }) => 
      MaterialService.updateMaterial(id, data),
    onSuccess: (updatedMaterial) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', updatedMaterial.Id_Material] });
    },
    onError: (error: any) => {
      console.error('Error al actualizar el material:', error);
    },
  });
};