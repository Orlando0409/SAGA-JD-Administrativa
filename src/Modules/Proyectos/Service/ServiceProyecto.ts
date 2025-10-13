// src/services/proyectoService.ts
import apiAuth from "@/Api/apiAuth";
import type { Proyecto, ProyectoFormData } from "../Models/ProyectoModels";

// Obtener todos los proyectos
export const getProyectos = async (): Promise<Proyecto[]> => {
  const res = await apiAuth.get("/proyectos/all");
  return res.data;
};

// Obtener solo proyectos visibles
export const getProyectosVisibles = async (): Promise<Proyecto[]> => {
  const res = await apiAuth.get("/proyectos/visibles");
  return res.data;
};

// Crear un proyecto
export const createProyecto = async (formData: FormData, idUsuarioCreador: number): Promise<Proyecto> => {
  const res = await apiAuth.post(`/proyectos/create/${idUsuarioCreador}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Editar un proyecto existente
export const updateProyecto = async (id: number, formData: Partial<ProyectoFormData>): Promise<Proyecto> => {
  const res = await apiAuth.put(`/proyectos/update/${id}`, formData);
  return res.data;
};

// Cambiar estado de un proyecto
export const updateEstadoProyecto = async (id: number, nuevoEstadoId: number): Promise<Proyecto> => {
  const res = await apiAuth.patch(`/proyectos/${id}/update/estado/${nuevoEstadoId}`);
  return res.data;
};

// Alternar visibilidad de un proyecto
export const toggleVisibilidadProyecto = async (id: number): Promise<Proyecto> => {
  const res = await apiAuth.patch(`/proyectos/update/visibilidad/${id}`);
  return res.data;
};
