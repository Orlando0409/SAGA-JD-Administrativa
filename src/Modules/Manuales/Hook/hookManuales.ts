import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Manual } from "../Models/ModelsManuales";
import { createManual, deleteManual, getManuales } from "../Services/ServicesManuales";

//  Hook para obtener todos los manuales
export const useGetManuales = () => {
  return useQuery<Manual[], Error>({
    queryKey: ["manuales"],
    queryFn: getManuales,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // reintenta una vez si falla
  });
};

// Hook para crear un manual
export const useCreateManual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createManual(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manuales"] });
    },
  });
};

//  Hook para eliminar un manual
export const useDeleteManual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteManual(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manuales"] });
    },
  });
};
