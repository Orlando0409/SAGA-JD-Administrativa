export interface UnidadMedicion {
  Id_Unidad_Medicion: number;
  // El backend devuelve "Nombre_Unidad" en las respuestas GET
  Nombre_Unidad?: string;
  // Pero espera "Nombre_Unidad_Medicion" en las peticiones POST/PUT
  Nombre_Unidad_Medicion?: string;
  Abreviatura: string;
  Descripcion: string;
  // El backend devuelve "Estado_Unidad_Medicion" o "Estado" según el contexto
  Estado_Unidad_Medicion?: EstadoUnidadMedicion;
  Estado?: EstadoUnidadMedicion; // Alias para compatibilidad
  Fecha_Creacion: Date | string;
  Fecha_Actualizacion: Date | string;
  Usuario_Creador: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
    Nombre_Rol: string;
  };
}

export interface EstadoUnidadMedicion {
  Id_Estado_Unidad_Medicion: number;
  Nombre_Estado_Unidad_Medicion: string;
}

export interface CreateUnidadMedicionData {
  Nombre_Unidad_Medicion: string; 
  Abreviatura: string;
  Descripcion?: string;
}

export interface UpdateUnidadMedicionData {
  Nombre_Unidad_Medicion?: string; // Match backend DTO field name
  Abreviatura?: string;
  Descripcion?: string;
}

export interface UnidadMedicionSimple {
  Id_Unidad_Medicion: number;
  Nombre_Unidad_Medicion?: string; // For DTO operations
  Nombre_Unidad?: string; // For display from database entity
}

// DTO para ingreso/egreso de materiales - Updated to match backend DTO
export interface IngresoEgresoMaterialData {
  Id_Material: number;
  Cantidad: number;
  Observaciones?: string;
}

// Helper function to get the unit name consistently
export const getUnidadMedicionNombre = (unidad: UnidadMedicion | UnidadMedicionSimple | undefined | null): string => {
  if (!unidad) return '';
  return unidad.Nombre_Unidad_Medicion || unidad.Nombre_Unidad || '';
};