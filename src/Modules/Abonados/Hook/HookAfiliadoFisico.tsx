import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { createAfiliadoFisico, getAfiliadosFisicos } from "../Service/ServiceAfiliadoFisico";
import type { AfiliadoFisico } from "../Models/ModeloAfiliadoFisico";

export const useAfiliadosFisicos = () => {
  // Query para obtener todos los afiliados físicos
  const queryClient = useQueryClient(); // 🔧 Agregar esta línea
  
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
   
    const createMutation = useMutation({
    mutationFn: (data: FormData) => createAfiliadoFisico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] }); // 🔧 Cambiar clave
      console.log("afiliado creado con exito ");
    },
    onError: () => console.error("no se creo el afiliado"),
  });
  return {
    afiliadosFisicos,
    isLoading,
    isError,
    error,
    refetch,
    createAfiliadoFisico: createMutation.mutateAsync,
  };
}