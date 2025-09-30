import { useQuery } from "@tanstack/react-query";
import { 
  getProveedoresFisicos, 
  getProveedorFisicoById
} from "../Services/proveedorservice";
import type { ProveedorFisico } from "../Models/TablaProveedo/proveedorFisico";

export const useProveedoresFisicos = () => {
  // Query para obtener todos los proveedores físicos
  const {
    data: proveedoresFisicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ProveedorFisico[]>({
    queryKey: ["proveedoresFisicos"],
    queryFn: getProveedoresFisicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return {
    proveedoresFisicos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useProveedorFisico = (id: number) => {
  return useQuery({
    queryKey: ['proveedorFisico', id],
    queryFn: () => getProveedorFisicoById(id),
    enabled: !!id,
  });
};
