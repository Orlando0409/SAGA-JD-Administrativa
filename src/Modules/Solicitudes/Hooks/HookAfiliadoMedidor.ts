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

            // Módulo de solicitudes
            queryClient.invalidateQueries({ queryKey: ["solicitudes-fisicas"] });
            queryClient.invalidateQueries({ queryKey: ["solicitudes-juridicas"] });
            // Módulo de afiliados (físicos y jurídicos)
            queryClient.invalidateQueries({ queryKey: ["afiliadosFisicos"] });
            queryClient.invalidateQueries({ queryKey: ["afiliadosJuridicos"] });
            queryClient.invalidateQueries({ queryKey: ["afiliados"] });
            queryClient.invalidateQueries({ queryKey: ["afiliado-medidor"] });
            // Módulo de medidores
            queryClient.invalidateQueries({ queryKey: ["medidores"] });
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
            console.log(" Iniciando asignación de medidor...", dto);
        },
    });
};