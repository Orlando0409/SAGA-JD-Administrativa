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

export const useGetMaterialesDisponibles = () => {
  return useQuery({
    queryKey: ['materials', 'disponibles'],
    queryFn: MaterialService.getMaterialesDisponibles,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesAgotados = () => {
  return useQuery({
    queryKey: ['materials', 'agotados'],
    queryFn: MaterialService.getMaterialesAgotados,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesDeBaja = () => {
  return useQuery({
    queryKey: ['materials', 'de-baja'],
    queryFn: MaterialService.getMaterialesDeBaja,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesAgotadosYDeBaja = () => {
  return useQuery({
    queryKey: ['materials', 'agotados-de-baja'],
    queryFn: MaterialService.getMaterialesAgotadosYDeBaja,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetMaterialesEntreRangoPrecio = (min: number, max: number) => {
  return useQuery({
    queryKey: ['materials', 'price-range', min, max],
    queryFn: () => MaterialService.getMaterialesEntreRangoPrecio(min, max),
    enabled: min > 0 && max > 0 && min <= max,
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

export const useUpdateEstadoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccessWithUndo, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ materialId, estadoMaterialId }: { materialId: number; estadoMaterialId: number }) =>
      MaterialService.updateEstadoMaterial(materialId, estadoMaterialId),
    onSuccess: (updatedMaterial, { materialId, estadoMaterialId }) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', materialId] });
      
      // Determinar la acción realizada basándose en el estado enviado
      let accion = 'actualizado';
      let estadoAnterior = 1; // Por defecto
      
      if (estadoMaterialId === 1) {
        // Intentó activar (De baja → Disponible)
        accion = 'activado';
        estadoAnterior = 3; // Para el undo vuelve a De baja
      } else if (estadoMaterialId === 3) {
        // Intentó dar de baja
        // Puede resultar en "De baja" (3) o "Agotado y de baja" (4) según backend
        const estadoFinal = updatedMaterial?.Estado_Material?.Id_Estado_Material;
        if (estadoFinal === 4) {
          accion = 'marcado como agotado y de baja';
          estadoAnterior = 2; // Volver a Agotado
        } else {
          accion = 'dado de baja';
          estadoAnterior = 1; // Volver a Disponible
        }
      } else if (estadoMaterialId === 2) {
        // Quitó el estado de baja (Agotado y de baja → Agotado)
        accion = 'marcado como agotado';
        estadoAnterior = 4; // Volver a Agotado y de baja
      }
      
      const undoAction = async () => {
        try {
          await MaterialService.updateEstadoMaterial(materialId, estadoAnterior);
          queryClient.invalidateQueries({ queryKey: ['materials'] });
          queryClient.invalidateQueries({ queryKey: ['material', materialId] });
        } catch (error) {
          showError('Error', 'No se pudo revertir el cambio');
          console.error('Error reverting material state in undo action:', error);
        }
      };

      showSuccessWithUndo(
        `Material ${accion}`, 
        `El material se ha ${accion} exitosamente`,
        undoAction
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el estado del material';
      
      // Mensaje específico para el error de cantidad 0
      if (errorMessage.includes('cantidad en stock es 0') || errorMessage.includes('Disponible')) {
        showError(
          'No se puede activar', 
          'No se puede activar un material con cantidad 0 en stock. Realice un movimiento de ingreso primero.'
        );
      } else {
        showError('Error', errorMessage);
      }
      
      console.error('Error updating material state:', error);
    },
  });
};

