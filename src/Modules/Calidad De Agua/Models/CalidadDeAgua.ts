
export interface ArchivoCalidadAgua {
  Id_Calidad_Agua: number; // ID del registro
  Titulo: string;          // Título del archivo
  Url_Archivo: string;     // URL del archivo subido
  fechaCreacion: string;   // Fecha de creación
}

export const ArchivoCalidadAgua: ArchivoCalidadAgua = {

    Id_Calidad_Agua: 0,
    Titulo: '',
    Url_Archivo: '', // URL del archivo PDF en el servidor
    fechaCreacion: '',
}
export interface CalidadAguaFormData {
   Id_Calidad_Agua: number;
  Titulo: string;
  Url_Archivo: string; // URL del archivo PDF en el servidor
  fechaCreacion: string;
}