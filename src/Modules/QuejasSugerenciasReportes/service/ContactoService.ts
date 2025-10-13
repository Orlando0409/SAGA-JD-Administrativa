// src/Modules/QuejasSugerenciasReportes/service/ContactoService.ts
import type { Queja, CreateQuejaData } from '../models/Quejas';
import type { Sugerencia, CreateSugerenciaData } from '../models/Sugerencias';
import type { Reporte, CreateReporteData } from '../models/Reportes';
import axiosPrivate from '@/Api/apiAuth';

// ======================== QUEJAS ========================
export async function obtenerQuejas(): Promise<Queja[]> {
  const response = await axiosPrivate.get('/quejas');
  return response.data;
}

export async function obtenerQueja(id: number): Promise<Queja> {
  const response = await axiosPrivate.get(`/quejas/${id}`);
  return response.data;
}

export async function crearQueja(queja: CreateQuejaData, adjunto?: File): Promise<Queja> {
  const formData = new FormData();
  formData.append('name', queja.name);
  if (queja.Papellido) {
    formData.append('Papellido', queja.Papellido);
  }
  if (queja.Sapellido) {
    formData.append('Sapellido', queja.Sapellido);
  }
  formData.append('descripcion', queja.descripcion);
  if (adjunto) {
    formData.append('Imagen', adjunto);
  }

  const response = await axiosPrivate.post('/quejas', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function actualizarEstadoQueja(id: number, idEstado: number): Promise<Queja> {
  const response = await axiosPrivate.patch(`/quejas/${id}/estado`, { 
    Id_Estado_Queja: idEstado 
  });
  return response.data;
}

export async function responderQueja(id: number, respuesta: string): Promise<Queja> {
  const response = await axiosPrivate.post(`/quejas/${id}/responder`, { 
    Respuesta: respuesta 
  });
  return response.data;
}

export async function eliminarQueja(id: number): Promise<void> {
  await axiosPrivate.delete(`/quejas/${id}`);
}

// ======================== SUGERENCIAS ========================
export async function obtenerSugerencias(): Promise<Sugerencia[]> {
  const response = await axiosPrivate.get('/sugerencias');
  return response.data;
}

export async function obtenerSugerencia(id: number): Promise<Sugerencia> {
  const response = await axiosPrivate.get(`/sugerencias/${id}`);
  return response.data;
}

export async function crearSugerencia(sugerencia: CreateSugerenciaData, adjunto?: File): Promise<Sugerencia> {
  const formData = new FormData();
  formData.append('Mensaje', sugerencia.Mensaje);
  if (adjunto) {
    formData.append('Adjunto', adjunto);
  }

  const response = await axiosPrivate.post('/sugerencias', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function actualizarEstadoSugerencia(id: number, idEstado: number): Promise<Sugerencia> {
  const response = await axiosPrivate.patch(`/sugerencias/${id}/estado`, { 
    Id_EstadoSugerencia: idEstado 
  });
  return response.data;
}

export async function responderSugerencia(id: number, respuesta: string): Promise<Sugerencia> {
  const response = await axiosPrivate.post(`/sugerencias/${id}/responder`, { 
    respuesta: respuesta 
  });
  return response.data;
}

export async function eliminarSugerencia(id: number): Promise<void> {
  await axiosPrivate.delete(`/sugerencias/${id}`);
}

// ======================== REPORTES ========================
export async function obtenerReportes(): Promise<Reporte[]> {
  const response = await axiosPrivate.get('/reportes');
  return response.data;
}

export async function obtenerReporte(id: number): Promise<Reporte> {
  const response = await axiosPrivate.get(`/reportes/${id}`);
  return response.data;
}

export async function crearReporte(reporte: CreateReporteData, adjunto?: File): Promise<Reporte> {
  const formData = new FormData();
  formData.append('name', reporte.name);
  formData.append('Papellido', reporte.Papellido);
  formData.append('Sapellido', reporte.Sapellido);
  formData.append('ubicacion', reporte.ubicacion);
  formData.append('descripcion', reporte.descripcion);
  if (adjunto) {
    formData.append('Imagen', adjunto);
  }

  const response = await axiosPrivate.post('/reportes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export async function actualizarEstadoReporte(id: number, idEstado: number): Promise<Reporte> {
  const response = await axiosPrivate.patch(`/reportes/${id}/estado`, { 
    IdEstadoReporte: idEstado 
  });
  return response.data;
}

export async function responderReporte(id: number, respuesta: string): Promise<Reporte> {
  const response = await axiosPrivate.post(`/reportes/${id}/responder`, { 
    Respuesta: respuesta 
  });
  return response.data;
}

export async function eliminarReporte(id: number): Promise<void> {
  await axiosPrivate.delete(`/reportes/${id}`);
}