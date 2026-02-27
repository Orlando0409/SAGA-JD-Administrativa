// src/Hooks/useActas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
//import { getActas, createActa, updateActa, deleteActa } from "@/Services/ActasService";
import type { Acta } from "../Models/ActasModels";
import { createActa, deleteActa, deleteArchivoActa, getActas, updateActa} from "../Services/ActasServices";

// Obtener todas las actas
export const useGetActas = () => {
  return useQuery<Acta[]>({
    queryKey: ["actas"],
    queryFn: getActas,
  });
};

// Crear una nueva acta
export const useCreateActa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createActa(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actas"] });
    },
  });
};
// para Actualizar una acta existente
export const useUpdateActa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => updateActa(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actas"] });
    },
  });
};

export const useDeleteArchivoActa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ idActa, idArchivo }: { idActa: number; idArchivo: number }) =>
      deleteArchivoActa(idActa, idArchivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actas"] });
    },
  });
};

// Eliminar un acta
export const useDeleteActa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteActa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actas"] });
    },
  });
};
