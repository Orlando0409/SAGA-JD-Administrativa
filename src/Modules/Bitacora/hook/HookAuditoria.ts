import { useQuery } from "@tanstack/react-query";
import { obtenerAuditorias, obtenerAuditoriaPorModulo, obtenerAuditoriaPorRegistro, obtenerAuditoriaPorUsuario } from "../service/AuditoriaService";

export const useGetAllAuditorias = () => {
  return useQuery({
    queryKey: ['auditorias'],
    queryFn: obtenerAuditorias,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
export const useGetAuditoriasPorModulo = (modulo: string) => {
  return useQuery({
    queryKey: ['auditorias', 'modulo', modulo],
    queryFn: () => obtenerAuditoriaPorModulo(modulo),
    enabled: !!modulo,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
export const useGetAuditoriasPorUsuario = (idUsuario: number) => {
  return useQuery({
    queryKey: ['auditorias', 'usuario', idUsuario],
    queryFn: () => obtenerAuditoriaPorUsuario(idUsuario),
    enabled: !!idUsuario,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
export const useGetAuditoriasPorRegistro = (modulo: string, idRegistro: number) => {
  return useQuery({
    queryKey: ['auditorias', 'registro', modulo, idRegistro],
    queryFn: () => obtenerAuditoriaPorRegistro(modulo, idRegistro),
    enabled: !!modulo && !!idRegistro,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};