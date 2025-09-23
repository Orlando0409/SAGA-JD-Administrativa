
export interface ArchivoCalidadAgua {
  id: number;
  Titulo: string;
  Archivo_Calidad_Agua: string; // URL del archivo PDF en el servidor
  fechaCreacion: string;
}

export const ArchivoCalidadAgua: ArchivoCalidadAgua = {

    id: 0,
    Titulo: '',
    Archivo_Calidad_Agua: '',
    fechaCreacion: '',
}
export interface CalidadAguaFormData {
   id: number;
  Titulo: string;
  Archivo_Calidad_Agua: string; // URL del archivo PDF en el servidor
  fechaCreacion: string;
}