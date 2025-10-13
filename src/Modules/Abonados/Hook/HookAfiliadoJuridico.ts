import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AfiliadoJuridico } from "../Models/TablaAfiliados/ModeloAfiliadoJuridico";
import { createAfiliadoJuridico, getAfiliadosJuridicos, updateAfiliadoJuridico } from "../Service/ServiceAfiliadoJuridico";

export const useAfiliadosJuridicos = () => {
  const queryClient = useQueryClient(); // 🔧 Agregar esta línea

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



  
  const createMutation = useMutation({
    mutationFn: (data: FormData) => createAfiliadoJuridico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] }); // 🔧 Cambiar clave
      console.log("afiliado juridico creado con exito");
    },
    onError: () => console.error("no se creo el afiliado juridico"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ cedulaJuridica, data }: { cedulaJuridica: string; data: FormData }) => updateAfiliadoJuridico(cedulaJuridica, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
      console.log("afiliado juridico actualizado con exito");
    },
    onError: () => console.error("no se actualizo el afiliado juridico"),
  });

  return {
    afiliadosJuridicos,
    isLoading,
    isError,
    error,
    refetch,
    createAfiliadoJuridico: createMutation.mutateAsync,
    updateAfiliadoJuridico: updateMutation.mutateAsync,
  };
}