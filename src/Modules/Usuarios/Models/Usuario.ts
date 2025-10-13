import type { Role } from "@/Modules/Roles/Models/Role";

export interface Usuario {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  Refresh_Token?: string;
  Fecha_Eliminacion: Date | string | null;
  Id_Rol: number;
  Rol: Role;
}
export interface CreateUserData {
  Nombre_Usuario: string;
  Correo_Electronico: string;
  Contraseña: string;
  Id_Rol: number;
}

export interface UpdateUserData {
  Nombre_Usuario: string;
  Correo_Electronico: string;
  Id_Rol: number;
}


// src/Modules/Usuarios/Models/Usuario.ts
export interface ChangePassword {
    UsuarioId: number;     
    Contraseña_Actual: string;    
    Nueva_Contraseña: string;    
}