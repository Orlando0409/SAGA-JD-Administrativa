export interface Usuario {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  Contraseña: string;
  Refresh_Token?: string;
  Fecha_Eliminacion: Date | string | null;
  Id_Rol: number;
  rol: RolUsuario;
}
export interface RolUsuario {
    Id_Rol: number;
    Nombre_Rol: string;
    permisos?: Permiso[];
}
export interface Permiso {
    id: number;
    modulo: string;
    Ver: boolean;
    Editar: boolean;
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


export interface ChangePassword {
  userid: number;
  currentPassword: string;
  newPassword: string;
}