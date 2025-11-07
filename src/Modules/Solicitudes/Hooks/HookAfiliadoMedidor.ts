import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AsignarMedidorDTO } from "../Models/ModeloMedidorAfiliacion";
import { ServiceAsignarMedidor } from "../Service/ServiceAfiliadomedidor";

export const useAsignarMedidor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: AsignarMedidorDTO) =>
            ServiceAsignarMedidor.asignarMedidor(dto),

        onSuccess: () => {

            // Invalida las cachés relacionadas para actualizar las listas
            queryClient.invalidateQueries({ queryKey: ["afiliados"] });
            queryClient.invalidateQueries({ queryKey: ["medidores"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-fisicas"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-juridicas"] });
            queryClient.invalidateQueries({ queryKey: ["afiliado-medidor"] });

        },

        onError: (error, variables) => {
            console.error("Error al asignar medidor", error);
            console.error(" Variables que fallaron:", variables);
        },

        onMutate: async (dto) => {
            console.log("⏳ Iniciando asignación de medidor...", dto);
        },
    });
};