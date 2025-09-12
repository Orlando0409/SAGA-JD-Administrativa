import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAfiliadosFisicos } from "../Service/ServiceAfiliadoFisico";
import type { AfiliadoFisico } from "../Models/ModeloAfiliadoFisico";

export const useAfiliadosFisicos = () => {
  const queryClient = useQueryClient();
  
    // Query para obtener todos los afiliados físicos
  const {
    data: afiliadosFisicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AfiliadoFisico[]>({
    queryKey: ["afiliadosFisicos"],
    queryFn: getAfiliadosFisicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return {
    afiliadosFisicos,
    isLoading,
    isError,
    error,
    refetch
  };
}