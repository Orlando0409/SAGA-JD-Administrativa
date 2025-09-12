import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AbonadoJuridico } from "../Models/ModeloAbonadoJuridico";
import { getAbonadosJuridicos, deleteAbonadoJuridico, createAbonadoJuridico, updateAbonadoJuridico } from "../Service/ServiceAbonadoJuridico";

export const useAbonadosJuridicos = () => {
    const queryClient = useQueryClient();

    // Query para obtener todos los abonados jurídicos
    const {
        data: abonadosJuridicos = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<AbonadoJuridico[]>({
        queryKey: ["abonadosJuridicos"],
        queryFn: getAbonadosJuridicos,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Mutación para crear un abonado jurídico
    const createMutation = useMutation({
        mutationFn: (abonado: Omit<AbonadoJuridico, 'Id_Abonado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>) => createAbonadoJuridico(abonado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonadosJuridicos"] });
            console.log("Abonado jurídico creado con éxito");
        },
        onError: (error) => {
            console.error("Error al crear el abonado jurídico:", error);
        },
    });

    // Mutación para actualizar un abonado jurídico
    const updateMutation = useMutation({
        mutationFn: ({ id, abonado }: { id: number; abonado: Partial<AbonadoJuridico> }) =>
            updateAbonadoJuridico(id, abonado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonadosJuridicos"] });
            console.log("Abonado jurídico actualizado con éxito");
        },
        onError: (error) => {
            console.error("Error al actualizar el abonado jurídico:", error);
        },
    });

    // Mutación para eliminar un abonado jurídico
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAbonadoJuridico(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["abonadosJuridicos"] });
            console.log("Abonado jurídico eliminado con éxito");
        },
        onError: (error) => {
            console.error("Error al eliminar el abonado jurídico:", error);
        },
    });

    return {
        abonadosJuridicos,
        isLoading,
        isError,
        error,
        refetch,
        createAbonadoJuridico: createMutation.mutateAsync,
        updateAbonadoJuridico: updateMutation.mutateAsync,
        deleteAbonadoJuridico: deleteMutation.mutateAsync,
    };
};