import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Abonado } from "../Models/ModelAbonado";
import { getAbonados, deleteAbonado } from "../Service/ServiceAbonado";

export const useAbonados = () => {
  const queryClient = useQueryClient();

  // Consulta para obtener todos los abonados
  const { data: abonados = [], isLoading, isError } = useQuery<Abonado[]>({
    queryKey: ["abonados"],
    queryFn: getAbonados,
  });

  // Mutación para eliminar un abonado
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAbonado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abonados"] });
      // Opcional: mensaje de éxito
      // console.log("Abonado eliminado con éxito");
    },
    onError: () => {
      // Opcional: mensaje de error
      // console.error("No se pudo eliminar el abonado");
    },
  });

  return {
    abonados,
    isLoading,
    isError,
    deleteAbonado: deleteMutation.mutateAsync,
  };
};
