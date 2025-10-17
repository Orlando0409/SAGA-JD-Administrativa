import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { 
  CreateUnidadMedicionData, 
  UpdateUnidadMedicionData 
} from '../models/UnidadMedicion';
import { getAllUnidadesMedicion, getAllUnidadesMedicionSimple, getUnidadesMedicionActivas, getUnidadesMedicionInactivas, createUnidadMedicion, updateUnidadMedicion, updateEstadoUnidadMedicion } from '../service/UnidadesMedicionService';


export const useUnidadesMedicion = () => {
  return useQuery({
    queryKey: ['unidades-medicion'],
    queryFn: getAllUnidadesMedicion,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useUnidadesMedicionSimple = () => {
  return useQuery({
    queryKey: ['unidades-medicion-simple'],
    queryFn: getAllUnidadesMedicionSimple,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useUnidadesMedicionActivas = () => {
  return useQuery({
    queryKey: ['unidades-medicion', 'activas'],
    queryFn: getUnidadesMedicionActivas,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUnidadesMedicionInactivas = () => {
  return useQuery({
    queryKey: ['unidades-medicion', 'inactivas'],
    queryFn: getUnidadesMedicionInactivas,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ data, idUsuarioCreador }: { data: CreateUnidadMedicionData; idUsuarioCreador: number }) => 
      createUnidadMedicion(data, idUsuarioCreador),
    onSuccess: () => {
      showSuccess('Éxito', 'Unidad de medición creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      showError('Error', errorMessage);
    },
  });
};

export const useUpdateUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ id, data, idUsuario }: { id: number; data: UpdateUnidadMedicionData; idUsuario: number }) => 
      updateUnidadMedicion(id, idUsuario, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Unidad de medición actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
      queryClient.invalidateQueries({ queryKey: ['unidad-medicion'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      showError('Error', errorMessage);
    },
  });
};

export const useUpdateEstadoUnidadMedicion = () => {
  const queryClient = useQueryClient();
  const { showSuccessWithUndo, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ unidadId, estadoUnidad, idUsuario }: { unidadId: number; estadoUnidad: number; idUsuario: number }) => updateEstadoUnidadMedicion(unidadId, estadoUnidad, idUsuario),
    onSuccess: (_, { unidadId, estadoUnidad, idUsuario }) => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
      queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
      queryClient.invalidateQueries({ queryKey: ['unidad-medicion'] });
      const accion = estadoUnidad === 1 ? 'activada' : 'desactivada';
      const estadoAnterior = estadoUnidad === 1 ? 2 : 1;
      
      const undoAction = async () => {
        try {
          await updateEstadoUnidadMedicion(unidadId, estadoAnterior, idUsuario);
          queryClient.invalidateQueries({ queryKey: ['unidades-medicion'] });
          queryClient.invalidateQueries({ queryKey: ['unidades-medicion-simple'] });
          queryClient.invalidateQueries({ queryKey: ['unidad-medicion'] });
        } catch (error) {
          console.error('Error reverting unit measurement state in undo action:', error);
        }
      };

      showSuccessWithUndo(
        `Unidad de medición ${accion}`, 
        `La unidad de medición se ha ${accion} exitosamente`,
        undoAction
      );
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el estado de la unidad de medición';
      showError('Error', errorMessage);
    },
  });
};
