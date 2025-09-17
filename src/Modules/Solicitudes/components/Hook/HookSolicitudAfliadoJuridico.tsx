import { useQuery } from "@tanstack/react-query";
import { getAfiliadosJuridicos } from "../Service/ServiceSolucitudAfiliadoJuridico";
import type { AfiliacionJuridica } from "../Models/ModelSolicitudAfiliadoJuridico";

// Hook único que puede filtrar por tipo o traer todos
export const useSolicitudAfiliadosJuridicos = (tipoId?: 1 | 2) => {
    const {
        data: allAfiliadosJuridicos = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<AfiliacionJuridica[]>({
        queryKey: ["solicitudAfiliadosJuridicos"],
        queryFn: getAfiliadosJuridicos,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Filtrar por tipo si se especifica, sino retornar todos
    const afiliadosJuridicos = tipoId
        ? allAfiliadosJuridicos.filter(afiliado => afiliado.Tipo_Afiliado.Id_Tipo_Afiliado === tipoId)
        : allAfiliadosJuridicos;

    return {
        afiliadosJuridicos,
        isLoading,
        isError,
        error,
        refetch,
    };
}
