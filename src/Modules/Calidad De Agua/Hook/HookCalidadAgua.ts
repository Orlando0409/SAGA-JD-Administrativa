import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getArchivosCalidadAgua, uploadArchivoCalidadAgua, updateArchivoCalidadAgua, deleteArchivoCalidadAgua, toggleVisibilidadArchivoCalidadAgua } from "../Service/ServiceCalidadAgua";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

// Obtener todos los registros
export const useGetCalidadAgua = () => {
  return useQuery<ArchivoCalidadAgua[]>({
    queryKey: ["calidadAgua"],
    queryFn: getArchivosCalidadAgua,
  });
};

// Subir un nuevo archivo
export const useUploadCalidadAgua = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData, idUsuarioCreador }: { formData: FormData; idUsuarioCreador: number }) => 
      uploadArchivoCalidadAgua(formData, idUsuarioCreador),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calidadAgua"] });
    },
  });
};

// Actualizar un archivo existente
export const useUpdateCalidadAgua = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => updateArchivoCalidadAgua(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calidadAgua"] });
    },
  });
};

//  visibilidad
export const useToggleVisibilidadCalidadAgua = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleVisibilidadArchivoCalidadAgua(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calidadAgua"] });
    },
  });
};


// Eliminar un archivo
export const useDeleteCalidadAgua = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteArchivoCalidadAgua(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calidadAgua"] });
    },
  });
};