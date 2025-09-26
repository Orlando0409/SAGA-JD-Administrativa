import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllMaterials, 
  getMaterialById, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial,
  getAllCategories,
  getMaterialsWithStock,
  createCategoria
} from '../service/InventarioService';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { UpdateMaterialData } from '../models/Inventario';

export const useMaterials = () => {
  return useQuery({
    queryKey: ['materials'],
    queryFn: getAllMaterials,
  });
};

export const useMaterial = (id: number) => {
  return useQuery({
    queryKey: ['material', id],
    queryFn: () => getMaterialById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  });
};

export const useMaterialsWithStock = () => {
  return useQuery({
    queryKey: ['materials-with-stock'],
    queryFn: getMaterialsWithStock,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-with-stock'] });
      showSuccess('Material creado', 'El material se ha creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'No se pudo crear el material';
      showError('Error', errorMessage);
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ Id_Material, materialData }: { Id_Material: number; materialData: UpdateMaterialData }) => 
      updateMaterial(Id_Material, materialData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', data.Id_Material] });
      queryClient.invalidateQueries({ queryKey: ['materials-with-stock'] });
      showSuccess('Material actualizado', 'Los datos se han actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'No se pudo actualizar el material';
      showError('Error', errorMessage);
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-with-stock'] });
      showSuccess('Material eliminado', 'El material se ha eliminado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'No se pudo eliminar el material';
      showError('Error', errorMessage);
    },
  });
};

export const useCreateCategoria = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Categoría creada', 'La categoría se ha creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'No se pudo crear la categoría';
      showError('Error', errorMessage);
    },
  });
};