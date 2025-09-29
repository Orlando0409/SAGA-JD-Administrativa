import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { 
  ingresoMaterial, 
  egresoMaterial 
} from '../service/InventarioService';
import type { 
  IngresoEgresoMaterialData 
} from '../models/UnidadMedicion';

// Tipo para el payload completo de ingreso/egreso
interface MaterialMovimientoPayload {
  materialId: number;
  data: IngresoEgresoMaterialData;
}

// Hook para ingreso de material
export const useIngresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ materialId, data }: MaterialMovimientoPayload) => 
      ingresoMaterial(materialId, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Ingreso de material registrado correctamente');
      // Invalidar las consultas relacionadas con materiales para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al registrar el ingreso de material';
      showError('Error', errorMessage);
    },
  });
};

// Hook para egreso de material
export const useEgresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ materialId, data }: MaterialMovimientoPayload) => 
      egresoMaterial(materialId, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Egreso de material registrado correctamente');
      // Invalidar las consultas relacionadas con materiales para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al registrar el egreso de material';
      showError('Error', errorMessage);
    },
  });
};