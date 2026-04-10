import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAfiliadoFisico, getAfiliadosFisicos, updateAfiliadoFisico, updateEstadoAfiliadoFisico, updateTipoAfiliadoFisico } from "../Service/ServiceAfiliadoFisico";
import type { AfiliadoFisico } from "../Models/TablaAfiliados/ModeloAfiliadoFisico";

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

  const updateMutation = useMutation({
    mutationFn: ({ cedula, data }: { cedula: string; data: FormData }) => updateAfiliadoFisico(cedula, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
      console.log("afiliado actualizado con exito");
    },
    onError: () => console.error("no se actualizo el afiliado"),
  });

  const updateEstadoMutation = useMutation({
    mutationFn: ({ id, nuevoEstadoId }: { id: string; nuevoEstadoId: number }) => updateEstadoAfiliadoFisico(id, nuevoEstadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
      console.log("estado del afiliado actualizado con exito");
    },
    onError: () => console.error("no se actualizo el estado del afiliado"),
  });

  const updateTipoMutation = useMutation({
    mutationFn: ({
      id,
      nuevoTipoId,
      archivos,
    }: {
      id: number;
      nuevoTipoId: number;
      archivos?: { Planos_Terreno?: File; Escrituras_Terreno?: File };
    }) => updateTipoAfiliadoFisico(id, nuevoTipoId, archivos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
      console.log("tipo del afiliado fisico actualizado con exito");
    },
    onError: () => console.error("no se actualizo el tipo del afiliado fisico"),
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