import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { 
  IngresoEgresoMaterialData 
} from '../models/UnidadMedicion';
import { ingresoMaterial, egresoMaterial } from '../service/MovimientosService';


interface MaterialMovimientoPayload {
  materialId: number;
  data: IngresoEgresoMaterialData;
}

export const useIngresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ materialId, data }: MaterialMovimientoPayload) => 
      ingresoMaterial(materialId, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Ingreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message;
      showError('Error', errorMessage);
    },
  });
};

export const useEgresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ materialId, data }: MaterialMovimientoPayload) => 
      egresoMaterial(materialId, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Egreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al registrar el egreso de material';
      showError('Error', errorMessage);
    },
  });
};