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
import { useAlerts } from "@/Modules/Global/context/AlertContext";

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
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData; }) =>
      createProyecto(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
      showSuccess('Proyecto creado', 'El proyecto se ha creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear el proyecto';
      showError('Error', errorMessage);
    }
  });

};

// Actualizar un proyecto existente - AHORA USA FormData
export const useUpdateProyecto = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      updateProyecto(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
      showSuccess('Proyecto actualizado', 'El proyecto se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el proyecto';
      showError('Error', errorMessage);
    }
  });
};

// Cambiar estado de un proyecto
export const useUpdateEstadoProyecto = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, nuevoEstadoId }: { id: number; nuevoEstadoId: number }) =>
      updateEstadoProyecto(id, nuevoEstadoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
      showSuccess('Estado actualizado', 'El estado del proyecto se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el estado del proyecto';
      showError('Error', errorMessage);
    }
  });
};

// Alternar visibilidad de un proyecto
export const useToggleVisibilidadProyecto = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: (id: number) => toggleVisibilidadProyecto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectosVisibles"] });
      showSuccess('Visibilidad actualizada', 'La visibilidad del proyecto se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar la visibilidad del proyecto';
      showError('Error', errorMessage);
    }
  });
};
