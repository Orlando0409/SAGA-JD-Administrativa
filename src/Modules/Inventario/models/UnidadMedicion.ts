export interface UnidadMedicion {
  Id_Unidad_Medicion: number;
  Nombre_Unidad: string; // Backend field name from UnidadMedicion entity
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
  Nombre_Unidad_Medicion?: string;
  Abreviatura?: string;
  Descripcion?: string;
}

export interface UnidadMedicionSimple {
  Id_Unidad_Medicion: number;
  Nombre_Unidad_Medicion: string; // This gets normalized in backend service
}

// DTO para ingreso/egreso de materiales
export interface IngresoEgresoMaterialData {
  Cantidad: number;
}