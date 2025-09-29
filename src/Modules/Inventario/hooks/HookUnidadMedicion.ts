import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { 
  getAllUnidadesMedicion, 
  createUnidadMedicion, 
  updateUnidadMedicion, 
  deleteUnidadMedicion,
  getAllUnidadesMedicionSimple
} from '../service/InventarioService';
import type { 
  CreateUnidadMedicionData, 
  UpdateUnidadMedicionData 
} from '../models/UnidadMedicion';

// Hook para obtener todas las unidades de medición
export const useUnidadesMedicion = () => {
  return useQuery({
    queryKey: ['unidades-medicion'],
    queryFn: getAllUnidadesMedicion,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener unidades de medición simplificadas (para dropdowns)
export const useUnidadesMedicionSimple = () => {
  return useQuery({
    queryKey: ['unidades-medicion-simple'],
    queryFn: getAllUnidadesMedicionSimple,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para crear unidad de medición
export const useCreateUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: (data: CreateUnidadMedicionData) => createUnidadMedicion(data),
    onSuccess: () => {
      showSuccess('Éxito', 'Unidad de medición creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear la unidad de medición';
      showError('Error', errorMessage);
    },
  });
};

// Hook para actualizar unidad de medición
export const useUpdateUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUnidadMedicionData }) => 
      updateUnidadMedicion(id, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Unidad de medición actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
      queryClient.invalidateQueries({ queryKey: ['unidad-medicion'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar la unidad de medición';
      showError('Error', errorMessage);
    },
  });
};

// Hook para eliminar unidad de medición
export const useDeleteUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: (id: number) => deleteUnidadMedicion(id),
    onSuccess: () => {
      showSuccess('Éxito', 'Unidad de medición eliminada correctamente');
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar la unidad de medición';
      showError('Error', errorMessage);
    },
  });
};