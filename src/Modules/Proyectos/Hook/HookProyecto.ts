import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProyectos,
  getProyectosVisibles,
  createProyecto,
  updateProyecto,
  updateEstadoProyecto,
  toggleVisibilidadProyecto,
} from "../Service/ServiceProyecto";
import type { Proyecto } from "../Models/ProyectoModels";

// Obtener todos los proyectos
export const useGetProyectos = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos"],
    queryFn: getProyectos,
  });
};

// Obtener solo proyectos visibles
export const useGetProyectosVisibles = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectosVisibles"],
    queryFn: getProyectosVisibles,
  });
};

// Crear un proyecto
export const useCreateProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData;  }) =>
      createProyecto(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
    },
  });

};

// Actualizar un proyecto existente - AHORA USA FormData
export const useUpdateProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProyecto(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
    },
  });
};

// Cambiar estado de un proyecto
export const useUpdateEstadoProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nuevoEstadoId }: { id: number; nuevoEstadoId: number }) =>
      updateEstadoProyecto(id, nuevoEstadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
    },
  });
};

// Alternar visibilidad de un proyecto
export const useToggleVisibilidadProyecto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleVisibilidadProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
    },
  });
};