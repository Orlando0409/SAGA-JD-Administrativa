
export interface ArchivoCalidadAgua {
  Id_Calidad_Agua: number; // ID del registro
  Titulo: string;          // Título del archivo
  Url_Archivo: string;     // URL del archivo subido
  Fecha_Creacion: string;  
  Fecha_Actualizacion: string; // Fecha de actualización
  Descripcion:string
  Visible: boolean;        // Campo de visibilidad (true = visible, false = oculto)
  Usuario_Creador: {       // Usuario que creó el registro
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol: string;
  };
}

export const ArchivoCalidadAguaInicial: ArchivoCalidadAgua = {
    Id_Calidad_Agua: 0,
    Titulo: '',
    Url_Archivo: '', 
    Fecha_Creacion: '',
    Fecha_Actualizacion: '',
    Descripcion:'',
    Visible: false, // Por defecto oculto hasta que se active
    Usuario_Creador: {
        Id_Usuario: 0,
        Nombre_Usuario: '',
        Id_Rol: 0,
        Nombre_Rol: ''
    }
}
export interface CalidadAguaFormData {
  Titulo: string;
  Archivo_Calidad_Agua: File | null; // Archivo a subir
}