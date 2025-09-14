import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getAbonados, deleteAbonado, createAbonado, updateAbonado } from "../Service/ServiceAbonado";
import type { Abonado } from "../Models/ModelAbonado";

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

    // Mutation para eliminar abonado
    const deleteAbonadoMutation = useMutation({
        mutationFn: deleteAbonado,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonados"] });
        },
    });

    // Mutation para crear abonado
    const createAbonadoMutation = useMutation({
        mutationFn: createAbonado,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonados"] });
        },
    });

    // Mutation para actualizar abonado
    const updateAbonadoMutation = useMutation({
        mutationFn: ({ id, abonado }: { id: number; abonado: Partial<Abonado> }) => updateAbonado(id, abonado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonados"] });
        },
    });

    return {
        abonados,
        isLoading,
        isError,
        error,
        refetch,
        deleteAbonado: deleteAbonadoMutation.mutateAsync,
        createAbonado: createAbonadoMutation.mutateAsync,
        updateAbonado: updateAbonadoMutation.mutateAsync,
    };
}