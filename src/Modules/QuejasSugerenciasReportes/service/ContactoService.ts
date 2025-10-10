// src/Modules/QuejasSugerenciasReportes/service/ContactoService.ts
import type { Queja } from '../models/Quejas';
import type { Sugerencia } from '../models/Sugerencias';
import type { Reporte } from '../models/Reportes';
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

export async function crearQueja(queja: Omit<Queja, 'id' | 'fechaCreacion'>): Promise<Queja> {
  const formData = new FormData();
  formData.append('Nombre', queja.nombre);
  formData.append('Primer_Apellido', queja.primerApellido);
  if (queja.segundoApellido) {
    formData.append('Segundo_Apellido', queja.segundoApellido);
  }
  formData.append('Mensaje', queja.mensaje);
  if (queja.adjunto) {
    formData.append('Imagen', queja.adjunto);
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

export async function crearSugerencia(sugerencia: Omit<Sugerencia, 'id' | 'fechaCreacion'>): Promise<Sugerencia> {
  const formData = new FormData();
  formData.append('Mensaje', sugerencia.mensaje);
  if (sugerencia.adjunto) {
    formData.append('Imagen', sugerencia.adjunto);
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

export async function crearReporte(reporte: Omit<Reporte, 'id' | 'fechaCreacion' | 'estado'>): Promise<Reporte> {
  const formData = new FormData();
  formData.append('Nombre', reporte.nombre);
  formData.append('Primer_Apellido', reporte.primerApellido);
  if (reporte.segundoApellido) {
    formData.append('Segundo_Apellido', reporte.segundoApellido);
  }
  formData.append('Ubicacion', reporte.ubicacion);
  formData.append('Mensaje', reporte.mensaje);
  if (reporte.adjunto) {
    formData.append('Imagen', reporte.adjunto);
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