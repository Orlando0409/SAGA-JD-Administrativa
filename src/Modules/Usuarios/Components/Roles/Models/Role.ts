export interface Role {
  Id_Rol: number;
  Nombre_Rol: string;
  permisos: Permiso[];
}

export interface CreateRoleData {
  Nombre_Rol: string;
  permisosIds: number[]; // Array de IDs específicos
}

export interface UpdateRoleData {
  Id_Rol: number;
  Nombre_Rol: string;
  permisosIds: number[]; // Array de IDs específicos
}

export interface Permiso {
  id: number;
  modulo: string;
  Ver: boolean; // true o false
  Editar: boolean; // true o false
}

