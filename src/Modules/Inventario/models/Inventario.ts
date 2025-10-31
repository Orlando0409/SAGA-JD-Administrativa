// Re-exports para facilitar las importaciones
export type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  EstadoMaterial,
  Proveedor
} from './Material';
export type { CategoriaMaterial, EstadoCategoria, CreateCategoriaMaterialData, UpdateCategoriaMaterialData } from './CategoriaMaterial';
export type { 
  UnidadMedicion, 
  EstadoUnidadMedicion, 
  CreateUnidadMedicionData, 
  UpdateUnidadMedicionData,
  UnidadMedicionSimple,
  IngresoEgresoMaterialData 
} from './UnidadMedicion';
export type { MovimientoMaterial, TipoMovimiento, FiltroMovimientos } from './MovimientoMaterial';
export type { 
  Medidor, 
  EstadoMedidor,
  CreateMedidorData,
} from './Medidor';