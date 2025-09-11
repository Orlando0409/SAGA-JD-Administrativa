import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AsociadoFisico } from "../../Models/Asociado/ModeloAsociadoFisico";
import { getAsociadoFisico, deleteAsociadoFisico, createAsociadoFisico, updateAsociadoFisico } from "../../Service/Asociado/ServiceAsociadoFisico";

export const useAsociadosFisicos = () => {
    const queryClient = useQueryClient();

    // Query para obtener todos los asociados físicos
    const {
        data: asociadosFisicos = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<AsociadoFisico[]>({
        queryKey: ["asociadosFisicos"],
        queryFn: getAsociadoFisico,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Mutación para crear un asociado físico
    const createMutation = useMutation({
        mutationFn: (asociado: Omit<AsociadoFisico, 'Id_Asociado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>) => createAsociadoFisico(asociado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosFisicos"] });
            console.log("Asociado físico creado con éxito");
        },
        onError: (error) => {
            console.error("Error al crear el asociado físico:", error);
        },
    });

    // Mutación para actualizar un asociado físico
    const updateMutation = useMutation({
        mutationFn: ({ id, asociado }: { id: number; asociado: Partial<AsociadoFisico> }) =>
            updateAsociadoFisico(id, asociado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosFisicos"] });
            console.log("Asociado físico actualizado con éxito");
        },
        onError: (error) => {
            console.error("Error al actualizar el asociado físico:", error);
        },
    });

    // Mutación para eliminar un asociado físico
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAsociadoFisico(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosFisicos"] });
            console.log("Asociado físico eliminado con éxito");
        },
        onError: (error) => {
            console.error("Error al eliminar el asociado físico:", error);
        },
    });

    return {
        asociadosFisicos,
        isLoading,
        isError,
        error,
        refetch,
        createAsociadoFisico: createMutation.mutateAsync,
        updateAsociadoFisico: updateMutation.mutateAsync,
        deleteAsociadoFisico: deleteMutation.mutateAsync,
    };
};