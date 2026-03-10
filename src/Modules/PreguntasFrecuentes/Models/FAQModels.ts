export interface Usuario {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Id_Rol: number;
  Nombre_Rol: string; 
}

export interface FAQ {
  Id_FAQ: number;
  Pregunta: string;
  Respuesta: string;
  Fecha_Creacion: string;
  Fecha_Actualizacion: string;
  Visible: boolean;
  Usuario?: Usuario | null;
}

export const FAQDefault: FAQ = {
  Id_FAQ: 0,
  Pregunta: "",
  Respuesta: "",
  Fecha_Creacion: "",
  Fecha_Actualizacion: "",
  Visible: true,
  Usuario: null,
};
