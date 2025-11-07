import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { AsignarMedidorDTO } from "../Models/ModeloMedidorAfiliacion";
import { ServiceAsignarMedidor } from "../Service/ServiceAfiliadoMedidor";


export const useAsignarMedidor = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    return useMutation({
        mutationFn: (dto: AsignarMedidorDTO) =>
            ServiceAsignarMedidor.asignarMedidor(dto),

        onSuccess: () => {
            showSuccess(
                'Medidor asignado',
                'El medidor se ha asignado correctamente al afiliado'
            );

            // Invalida las cachés relacionadas para actualizar las listas
            queryClient.invalidateQueries({ queryKey: ["afiliados"] });
            queryClient.invalidateQueries({ queryKey: ["medidores"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-fisicas"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-juridicas"] });
            queryClient.invalidateQueries({ queryKey: ["afiliado-medidor"] });
            queryClient.invalidateQueries({ queryKey: ["medidores-no-instalados"] });

        },

        onError: (error, variables) => {
            console.error("Error al asignar medidor", error);
            console.error("Variables que fallaron:", variables);
            
            showError(
                'Error al asignar medidor',
                'No se pudo completar la asignación del medidor. Por favor, intente nuevamente.'
            );
        },

        onMutate: async (dto) => {
            console.log("⏳ Iniciando asignación de medidor...", dto);
        },
    });
};