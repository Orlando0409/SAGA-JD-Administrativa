export interface UnidadMedicion {
  Id_Unidad_Medicion: number;
  // Support both field names for compatibility
  Nombre_Unidad_Medicion?: string; // For DTO operations (create/update)
  Nombre_Unidad?: string; // For display from database entity
  Abreviatura: string;
  Descripcion?: string;
  Estado_Unidad_Medicion: EstadoUnidadMedicion;
  Fecha_Creacion: Date | string;
  Fecha_Actualizacion: Date | string;
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
  // Support both field names for compatibility
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