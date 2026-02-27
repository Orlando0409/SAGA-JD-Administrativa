import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAfiliadoFisico,
  getAfiliadosFisicos,
  updateAfiliadoFisico,
  updateEstadoAfiliadoFisico,
  updateTipoAfiliadoFisico,
} from "../Service/ServiceAfiliadoFisico";
import type { AfiliadoFisico } from "../Models/TablaAfiliados/ModeloAfiliadoFisico";

export const useAfiliadosFisicos = () => {
  const queryClient = useQueryClient();

  const {
    data: afiliadosFisicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AfiliadoFisico[]>({
    queryKey: ["afiliadosFisicos"],
    queryFn: getAfiliadosFisicos,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createAfiliadoFisico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
    },
    onError: () => console.error("no se creo el afiliado"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ cedula, data }: { cedula: string; data: FormData }) => updateAfiliadoFisico(cedula, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
    },
    onError: () => console.error("no se actualizo el afiliado"),
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, nuevoEstadoId }: { id: string; nuevoEstadoId: number }) => updateEstadoAfiliadoFisico(id, nuevoEstadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
    },
    onError: () => console.error("no se actualizo el estado del afiliado"),
  });

  // PATCH /afiliados/update/tipo/fisico/:id/tipo/:nuevoTipoId
  const updateTipoMutation = useMutation({
    mutationFn: ({ id, nuevoTipoId }: { id: number; nuevoTipoId: number }) => updateTipoAfiliadoFisico(id, nuevoTipoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
    },
    onError: () => console.error("no se actualizo el tipo del afiliado"),
  });

  return {
    afiliadosFisicos,
    isLoading,
    isError,
    error,
    refetch,
    createAfiliadoFisico: createMutation.mutateAsync,
    updateAfiliadoFisico: updateMutation.mutateAsync,
    updateEstadoAfiliadoFisico: updateEstadoMutation,
    updateTipoAfiliadoFisico: updateTipoMutation,
  };
}