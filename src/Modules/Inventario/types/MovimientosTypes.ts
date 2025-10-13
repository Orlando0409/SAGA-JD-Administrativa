import type { TipoMovimiento } from '../models/MovimientoMaterial';

export interface MovimientoFilterOptions {
  fechaInicio?: string;
  fechaFin?: string;
  materialId?: number;
  materialNombre?: string;
  tipoMovimiento?: TipoMovimiento;
  usuario?: string;
  soloIngresos?: boolean;
  soloEgresos?: boolean;
  cantidadMinima?: number;
  cantidadMaxima?: number;
}

export interface MovimientoFormData {
  materialId: number;
  tipoMovimiento: TipoMovimiento;
  cantidad: number;
  motivo?: string;
  observaciones?: string;
  fechaMovimiento?: string;
}

export interface MovimientoTableData {
  id: number;
  fecha: string;
  material: string;
  tipo: TipoMovimiento;
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo?: string;
  usuario?: string;
  observaciones?: string;
}