import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { 
  IngresoEgresoMaterialData 
} from '../models/Inventario';
import { ingresoMaterial, egresoMaterial, getAllMovimientos } from '../service/MovimientosService';


interface MaterialMovimientoPayload {
  idUsuario: number;
  data: IngresoEgresoMaterialData;
}

export const useIngresoMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  return useMutation({
    mutationFn: ({ idUsuario, data }: MaterialMovimientoPayload) => 
      ingresoMaterial(idUsuario, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Ingreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
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
    mutationFn: ({ idUsuario, data }: MaterialMovimientoPayload) => 
      egresoMaterial(idUsuario, data),
    onSuccess: () => {
      showSuccess('Éxito', 'Egreso de material registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al registrar el egreso de material';
      showError('Error', errorMessage);
    },
  });
};

export const useGetAllMovimientos = () => {
  return useQuery({
    queryKey: ['movimientos'],
    queryFn: getAllMovimientos,
  });
};