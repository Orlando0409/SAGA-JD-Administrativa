// Re-exports para facilitar las importaciones
export type { 
  Material, 
  CreateMaterialData, 
  UpdateMaterialData, 
  EstadoMaterial,
  Medidor,
  EstadoMedidor,
  AfiliadoMedidor,
  CreateMedidorData,
  AsignarMedidorData,
  Proveedor
} from './Material';
export type { CategoriaMaterial, MaterialCategoria, EstadoCategoria, CreateCategoriaMaterialData, UpdateCategoriaMaterialData } from './CategoriaMaterial';
export type { 
  UnidadMedicion, 
  EstadoUnidadMedicion, 
  CreateUnidadMedicionData, 
  UpdateUnidadMedicionData,
  UnidadMedicionSimple,
  IngresoEgresoMaterialData 
} from './UnidadMedicion';
export type { MovimientoMaterial, TipoMovimiento, FiltroMovimientos } from './MovimientoMaterial';