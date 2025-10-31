import type { UsuarioCreador } from "@/Modules/Inventario/models/CategoriaMaterial";

export interface Auditoria {
  Id_Auditoria: number;
  Modulo: string;
  Accion: string;
  Nombre_Registro: string;
  Datos_Anteriores: string | null;
  Datos_Nuevos: string | null;
  Fecha_Accion: string | Date | null; 
  Usuario: UsuarioCreador;
}