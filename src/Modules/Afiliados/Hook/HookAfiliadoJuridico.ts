import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AfiliadoJuridico } from "../Models/TablaAfiliados/ModeloAfiliadoJuridico";
import {
  createAfiliadoJuridico,
  getAfiliadosJuridicos,
  updateAfiliadoJuridico,
  updateEstadoAfiliadoJuridico,
  updateTipoAfiliadoJuridico,
} from "../Service/ServiceAfiliadoJuridico";

export const useAfiliadosJuridicos = () => {
  const queryClient = useQueryClient();

  const {
    data: afiliadosJuridicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<AfiliadoJuridico[]>({
    queryKey: ["afiliadosJuridicos"],
    queryFn: getAfiliadosJuridicos,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createAfiliadoJuridico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
    },
    onError: () => console.error("no se creo el afiliado juridico"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ cedulaJuridica, data }: { cedulaJuridica: string; data: FormData }) => updateAfiliadoJuridico(cedulaJuridica, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
    },
    onError: () => console.error("no se actualizo el afiliado juridico"),
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, nuevoEstadoId }: { id: string; nuevoEstadoId: number }) => updateEstadoAfiliadoJuridico(id, nuevoEstadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
    },
    onError: () => console.error("no se actualizo el estado del afiliado juridico"),
  });

  // PATCH /afiliados/update/tipo/juridico/:id/tipo/:nuevoTipoId
  const updateTipoMutation = useMutation({
    mutationFn: ({ id, nuevoTipoId }: { id: number; nuevoTipoId: number }) => updateTipoAfiliadoJuridico(id, nuevoTipoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
    },
    onError: () => console.error("no se actualizo el tipo del afiliado juridico"),
  });

  return {
    afiliadosJuridicos,
    isLoading,
    isError,
    error,
    refetch,
    createAfiliadoJuridico: createMutation.mutateAsync,
    updateAfiliadoJuridico: updateMutation.mutateAsync,
    updateEstadoAfiliadoJuridico: updateEstadoMutation,
    updateTipoAfiliadoJuridico: updateTipoMutation,
  };
}