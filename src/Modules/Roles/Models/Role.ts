import type { FechaEliminacionType } from "@/Modules/Usuarios/Types/UserTypes";

export interface Role {
  Id_Rol: number;
  Nombre_Rol: string;
  Permisos: Permiso[];
  Fecha_Eliminacion: FechaEliminacionType;
}

export interface CreateRoleData {
  Nombre_Rol: string;
  IDS_Permisos: number[];
}

export interface UpdateRoleData {
  Nombre_Rol: string;
  IDS_Permisos: number[]; 
}

export interface Permiso {
  Id: number;
  Modulo: string;
  Ver: boolean; 
  Editar: boolean; 
}
