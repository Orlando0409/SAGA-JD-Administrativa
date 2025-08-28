export interface Usuario {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Correo_Electronico: string;
  password: string;
  RefreshToken?: string;
  id_rol: number;
  rol: RolUsuario;
}

export const UsuarioInitialState = {
    id: 0,
    nombreUsuario: '',
    email: '',
    password: '',
    IdRol: 0,
}

export interface RolUsuario {
    Id_Rol: number;
    Nombre_Rol: string;
    permisos?: Permiso[];
}

export const RolUsuarioInitialState = {
    id: 0,
    nombreRol: '',
    permisos: []
}
export interface Permiso {
    id: number;
    modulo: string;
    Ver: boolean;
    Editar: boolean;
}
