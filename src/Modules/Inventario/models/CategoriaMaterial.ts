export interface UsuarioCreador
{
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol: string;
}
export interface CategoriaMaterial {
  Id_Categoria: number;
  Nombre_Categoria: string;
  Descripcion_Categoria?: string;
  Fecha_Creacion?: Date | string;
  Fecha_Actualizacion?: Date | string;
  Estado_Categoria?: EstadoCategoria;
  Usuario?: UsuarioCreador;
}

export interface EstadoCategoria {
  Id_Estado_Categoria: number;
  Nombre_Estado_Categoria: string;
}

export interface CreateCategoriaMaterialData {
  Nombre_Categoria: string;
  Descripcion_Categoria?: string;
}

export interface UpdateCategoriaMaterialData {
  Nombre_Categoria?: string;
  Descripcion_Categoria?: string;
}