import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AfiliadoJuridico } from "../Models/ModeloAfiliadoJuridico";
import { getAfiliadosJuridicos } from "../Service/ServiceAfiliadoJuridico";

export const useAfiliadosJuridicos = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los afiliados jurídicos
  const {
    data: afiliadosJuridicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AfiliadoJuridico[]>({
    queryKey: ["afiliadosJuridicos"],
    queryFn: getAfiliadosJuridicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return {
    afiliadosJuridicos,
    isLoading,
    isError,
    error,
    refetch
  };
}