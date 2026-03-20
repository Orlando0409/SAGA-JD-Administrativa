
interface UsuarioCreador {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Id_Rol: number;
  Nombre_Rol: string;
}

export interface Auditoria {
  Id_Auditoria: number;
  Modulo: string;
  Accion: string;
  Registro_Afectado: string;
  Datos_Anteriores: string | null;
  Datos_Nuevos: string | null;
  Fecha_Accion: string | Date | null; 
  Usuario: UsuarioCreador;
}