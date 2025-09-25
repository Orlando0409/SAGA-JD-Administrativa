// src/Modules/QuejasSugerenciasReportes/service/ContactoService.ts
import type { Queja } from '../models/Quejas';
import type { Sugerencia } from '../models/Sugerencias';
import type { Reporte } from '../models/Reportes';
import axiosPrivate from '@/Api/apiAuth';

// ======================== QUEJAS ========================
export async function obtenerQuejas(): Promise<Queja[]> {
  const response = await axiosPrivate.get('/contacto/quejas');
  return response.data;
}

export async function crearQueja(queja: Omit<Queja, 'id' | 'fechaCreacion'>): Promise<Queja> {
  const formData = new FormData();
  formData.append('nombre', queja.nombre);
  formData.append('primerApellido', queja.primerApellido);
  if (queja.segundoApellido) {
    formData.append('segundoApellido', queja.segundoApellido);
  }
  formData.append('mensaje', queja.mensaje);
  if (queja.adjunto) {
    formData.append('adjunto', queja.adjunto);
  }

  const response = await axiosPrivate.post('/contacto/quejas', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function eliminarQueja(id: number): Promise<void> {
  await axiosPrivate.delete(`/contacto/quejas/${id}`);
}

// ======================== SUGERENCIAS ========================
export async function obtenerSugerencias(): Promise<Sugerencia[]> {
  const response = await axiosPrivate.get('/contacto/sugerencias');
  return response.data;
}

export async function crearSugerencia(sugerencia: Omit<Sugerencia, 'id' | 'fechaCreacion'>): Promise<Sugerencia> {
  const formData = new FormData();
  formData.append('mensaje', sugerencia.mensaje);
  if (sugerencia.adjunto) {
    formData.append('adjunto', sugerencia.adjunto);
  }

  const response = await axiosPrivate.post('/contacto/sugerencias', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function eliminarSugerencia(id: number): Promise<void> {
  await axiosPrivate.delete(`/contacto/sugerencias/${id}`);
}

// ======================== REPORTES ========================
export async function obtenerReportes(): Promise<Reporte[]> {
  const response = await axiosPrivate.get('/contacto/reportes');
  return response.data;
}

export async function crearReporte(reporte: Omit<Reporte, 'id' | 'fechaCreacion' | 'estado'>): Promise<Reporte> {
  const formData = new FormData();
  formData.append('nombre', reporte.nombre);
  formData.append('primerApellido', reporte.primerApellido);
  if (reporte.segundoApellido) {
    formData.append('segundoApellido', reporte.segundoApellido);
  }
  formData.append('ubicacion', reporte.ubicacion);
  formData.append('mensaje', reporte.mensaje);
  if (reporte.adjunto) {
    formData.append('adjunto', reporte.adjunto);
  }

  const response = await axiosPrivate.post('/contacto/reportes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function actualizarEstadoReporte(id: number, estado: string): Promise<Reporte> {
  const response = await axiosPrivate.patch(`/contacto/reportes/${id}/estado`, { estado });
  return response.data;
}

export async function eliminarReporte(id: number): Promise<void> {
  await axiosPrivate.delete(`/contacto/reportes/${id}`);
}