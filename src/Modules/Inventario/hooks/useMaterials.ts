import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as MaterialService from '../service/MaterialService';
import type { CreateMaterialData, UpdateMaterialData } from '../models/Inventario';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
export const useGetAllMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: MaterialService.getAllMaterials,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

export const useGetMaterialById = (id: number) => {
  return useQuery({
    queryKey: ['material', id],
    queryFn: () => MaterialService.getMaterialById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesConCategorias = () => {
  return useQuery({
    queryKey: ['materials', 'with-categories'],
    queryFn: MaterialService.getMaterialesConCategorias,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesSinCategorias = () => {
  return useQuery({
    queryKey: ['materials', 'without-categories'],
    queryFn: MaterialService.getMaterialesSinCategorias,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesPorEncimaDeStock = (threshold: number) => {
  return useQuery({
    queryKey: ['materials', 'above-stock', threshold],
    queryFn: () => MaterialService.getMaterialesPorEncimaDeStock(threshold),
    enabled: threshold > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesPorDebajoDeStock = (threshold: number) => {
  return useQuery({
    queryKey: ['materials', 'below-stock', threshold],
    queryFn: () => MaterialService.getMaterialesPorDebajoDeStock(threshold),
    enabled: threshold > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ data, idUsuarioCreador }: { data: CreateMaterialData; idUsuarioCreador: number }) => 
      MaterialService.createMaterial(data, idUsuarioCreador),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      showSuccess('Material creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear el material';
      showError('Error', errorMessage);
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMaterialData }) => 
      MaterialService.updateMaterial(id, data),
    onSuccess: (updatedMaterial) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', updatedMaterial.Id_Material] });
      showSuccess('Material actualizado exitosamente');
    },
    onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Error al actualizar el material';
        showError('Error', errorMessage);
    },
  });
};
