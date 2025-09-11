import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AsociadoJuridico } from "../../Models/Asociado/ModeloAsociadoJuridico";
import { getAsociadoJuridicos, deleteAsociadoJuridico, createAsociadoJuridico, updateAsociadoJuridico } from "../../Service/Asociado/ServiceAsociadoJuridico";

export const useAsociadosJuridicos = () => {
    const queryClient = useQueryClient();

    // Query para obtener todos los asociados jurídicos
    const {
        data: asociadosJuridicos = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<AsociadoJuridico[]>({
        queryKey: ["asociadosJuridicos"],
        queryFn: getAsociadoJuridicos,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Mutación para crear un asociado jurídico
    const createMutation = useMutation({
        mutationFn: (asociado: Omit<AsociadoJuridico, 'Id_Asociado' | 'Fecha_Creacion' | 'Fecha_Actualizacion'>) => createAsociadoJuridico(asociado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosJuridicos"] });
            console.log("Asociado jurídico creado con éxito");
        },
        onError: (error) => {
            console.error("Error al crear el asociado jurídico:", error);
        },
    });

    // Mutación para actualizar un asociado jurídico
    const updateMutation = useMutation({
        mutationFn: ({ id, asociado }: { id: number; asociado: Partial<AsociadoJuridico> }) =>
            updateAsociadoJuridico(id, asociado),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosJuridicos"] });
            console.log("Asociado jurídico actualizado con éxito");
        },
        onError: (error) => {
            console.error("Error al actualizar el asociado jurídico:", error);
        },
    });

    // Mutación para eliminar un asociado jurídico
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAsociadoJuridico(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociadosJuridicos"] });
            console.log("Asociado jurídico eliminado con éxito");
        },
        onError: (error) => {
            console.error("Error al eliminar el asociado jurídico:", error);
        },
    });

    return {
        asociadosJuridicos,
        isLoading,
        isError,
        error,
        refetch,
        createAsociadoJuridico: createMutation.mutateAsync,
        updateAsociadoJuridico: updateMutation.mutateAsync,
        deleteAsociadoJuridico: deleteMutation.mutateAsync,
    };
};