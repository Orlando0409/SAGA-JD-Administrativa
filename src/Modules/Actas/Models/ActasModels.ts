export interface ArchivoActa {
  Id_Archivo_Acta: number; // ID único del archivo
  Url_Archivo: string;     // URL del archivo subido
}

export interface Acta {
  Id_Acta: number;             // ID único del acta
  Id_Usuario: number;          // ID del usuario que creó el acta
  Titulo: string;              // Título del acta
  Descripcion: string;         // Descripción del acta
  Fecha_Creacion: string;      // Fecha de creación (ISO string, ej: "2025-09-24T15:00:00Z")
  Fecha_Actualizacion: string; // Fecha de última actualización (ISO string)
  Archivos: ArchivoActa[];     // Lista de archivos asociados al acta
}

export const ActaDefault: Acta = {
  Id_Acta: 0,
  Id_Usuario: 0,
  Titulo: '',
  Descripcion: '',
  Fecha_Creacion: '',
  Fecha_Actualizacion: '',
  Archivos: [], // Lista vacía de archivos por defecto
};

export interface ActaFormData {
  Titulo: string;              // Título del acta
  Descripcion: string;         // Descripción del acta
  Archivo_Acta: File | null;   // Archivo asociado al acta (para subir o reemplazar)
}