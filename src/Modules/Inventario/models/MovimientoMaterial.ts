import type { Material } from './Material';

export type TipoMovimiento = 'Entrada' | 'Salida';

export interface MovimientoMaterial {
  Id_Ingreso_Egreso: number;
  Id_Material?: number;
  Material?: Material;
  Tipo_Movimiento: TipoMovimiento;
  Cantidad: number;
  Cantidad_Anterior: number;
  Cantidad_Nueva: number;
  Motivo?: string;
  Usuario_Creador?: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Id_Rol: number;
  };
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