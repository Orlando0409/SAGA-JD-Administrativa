
export interface ArchivoProyecto {
  Id_Archivo_Proyecto: number;
  Url_Archivo: string;
}


export interface UsuarioProyecto {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Id_Rol: number;
  Nombre_Rol: string;
}


export interface EstadoProyecto {
  Id_Estado_Proyecto: number;
  Nombre_Estado: string;
}


export interface Proyecto {
  Id_Proyecto: number;
  Titulo: string;
  Descripcion: string;
  Fecha_Creacion: string;
  Fecha_Actualizacion: string;
  Visible: boolean;
  Imagen_Url: string;
  Estado: EstadoProyecto;
  Usuario: UsuarioProyecto;
  Archivos?: ArchivoProyecto[]; // Opcional, si manejas archivos adicionales
}



export interface ProyectoFormData {
  Titulo: string;
  Descripcion: string;
  Imagen_Url: string; 
  Id_Estado_Proyecto?: number;  
}