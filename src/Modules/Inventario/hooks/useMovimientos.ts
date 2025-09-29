import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as MovimientosService from '../service/MovimientosService';
import type { IngresoEgresoMaterialData } from '../models/Inventario';


export const useIngresoMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materialId, data }: { materialId: number; data: IngresoEgresoMaterialData }) => 
      MovimientosService.ingresoMaterial(materialId, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
    onError: (error: any) => {
      console.error('Error al registrar ingreso:', error);
    },
  });
};

export const useEgresoMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ materialId, data }: { materialId: number; data: IngresoEgresoMaterialData }) => 
      MovimientosService.egresoMaterial(materialId, data),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
    },
    onError: (error: any) => {
      console.error('Error al registrar egreso:', error);
    },
  });
};