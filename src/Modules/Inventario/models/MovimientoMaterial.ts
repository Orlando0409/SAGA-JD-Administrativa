import type { Material } from './Material';

export type TipoMovimiento = 'INGRESO' | 'EGRESO';

export interface MovimientoMaterial {
  Id_Movimiento: number;
  Id_Material: number;
  Material?: Material;
  Tipo_Movimiento: TipoMovimiento;
  Cantidad: number;
  Cantidad_Anterior: number;
  Cantidad_Nueva: number;
  Motivo?: string;
  Usuario?: string;
  Fecha_Movimiento: Date;
  Observaciones?: string;
}

export interface CreateMovimientoData {
  Id_Material: number;
  Tipo_Movimiento: TipoMovimiento;
  Cantidad: number;
  Motivo?: string;
  Observaciones?: string;
}

export interface FiltroMovimientos {
  fechaInicio?: string;
  fechaFin?: string;
  materialId?: number;
  tipoMovimiento?: TipoMovimiento;
}