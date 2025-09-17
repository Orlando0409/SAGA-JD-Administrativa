import { useQuery } from "@tanstack/react-query";
import { getAfiliadosFisicos } from "../Service/ServiceSolicitudAfiliadoFisico";
import type { AfiliacionFisica } from "../Models/ModelSolicitudAfiliadoFisico";

// Hook único que puede filtrar por tipo o traer todos
export const useSolicitudAfiliadosFisicos = (tipoId?: 1 | 2) => {
    const {
        data: allAfiliadosFisicos = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery<AfiliacionFisica[]>({
        queryKey: ["solicitudAfiliadosFisicos"],
        queryFn: getAfiliadosFisicos,
        staleTime: 5 * 60 * 1000, // 5 minutos
        retry: 3,
    });

    // Filtrar por tipo si se especifica, sino retornar todos
    const afiliadosFisicos = tipoId
        ? allAfiliadosFisicos.filter(afiliado => afiliado.Tipo_Afiliado.Id_Tipo_Afiliado === tipoId)
        : allAfiliadosFisicos;

    return {
        afiliadosFisicos,
        isLoading,
        isError,
        error,
        refetch,
    };
}
