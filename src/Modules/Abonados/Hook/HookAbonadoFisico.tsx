import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Abonado } from "../Models/ModeloAbonadoFisico";
import { getAbonados, deleteAbonado, createAbonado, updateAbonado } from "../Service/ServiceAbonadoFisico";

export const useAbonados = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los abonados
  const {
    data: abonados = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<Abonado[]>({
    queryKey: ["abonados"],
    queryFn: getAbonados,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  // Mutación para crear un abonado
  const createMutation = useMutation({
    mutationFn: (abonado: Omit<Abonado, 'Id_Abonado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>) => createAbonado(abonado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abonados"] });
      console.log("Abonado creado con éxito");
    },
    onError: (error) => {
      console.error("Error al crear el abonado:", error);
    },
  });

  // Mutación para actualizar un abonado
  const updateMutation = useMutation({
    mutationFn: ({ id, abonado }: { id: number; abonado: Partial<Abonado> }) =>
      updateAbonado(id, abonado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abonados"] });
      console.log("Abonado actualizado con éxito");
    },
    onError: (error) => {
      console.error("Error al actualizar el abonado:", error);
    },
  });

  // Mutación para eliminar un abonado
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAbonado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["abonados"] });
      console.log("Abonado eliminado con éxito");
    },
    onError: (error) => {
      console.error("Error al eliminar el abonado:", error);
    },
  });

  return {
    abonados,
    isLoading,
    isError,
    error,
    refetch,
    createAbonado: createMutation.mutateAsync,
    updateAbonado: updateMutation.mutateAsync,
    deleteAbonado: deleteMutation.mutateAsync,
  };
};
