export interface ArchivoActa {
  Id_Archivo_Acta: number; // ID único del archivo
  Url_Archivo: string;     // URL del archivo subido
}
interface Usuario{
  Id_Usuario: number;      // ID único del usuario
  Nombre_Usuario: string;          // Nombre del usuario
  Id_Rol: number;         // ID del rol del usuario (ej: 1 para admin, 2 para editor, etc.)
  Nombre_Rol: string;     // Nombre del rol del usuario (ej: "Administrador", "Editor", etc.)
}
export interface Acta {
  Id_Acta: number;             // ID único del acta
  Usuario: Usuario;          // ID del usuario que creó el acta
  Titulo: string;              // Título del acta
  Descripcion: string;         // Descripción del acta
  Fecha_Creacion: string;      // Fecha de creación (ISO string, ej: "2025-09-24T15:00:00Z")
  Fecha_Actualizacion: string; // Fecha de última actualización (ISO string)
  Archivos: ArchivoActa[];     // Lista de archivos asociados al acta
}


export interface ActaFormData {
  Titulo: string;              // Título del acta
  Descripcion: string;         // Descripción del acta
  Archivo_Acta: File | null;   // Archivo asociado al acta (para subir o reemplazar)
}