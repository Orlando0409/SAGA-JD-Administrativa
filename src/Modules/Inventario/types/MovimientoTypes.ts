import type { Material } from '../models/Inventario';

// Validation constants
export const CANTIDAD_MOVIMIENTO_MIN = 1;
export const CANTIDAD_MOVIMIENTO_MAX = 100000;
export const OBSERVACIONES_MAX_LENGTH = 250;

export type MovimientoType = 'entrada' | 'salida';

export interface CreateMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMaterial?: Material;
}

export interface MovimientoFormData {
  tipoMovimiento: MovimientoType;
  selectedMaterial: Material | null;
  cantidad: number;
  descripcion: string;
  busquedaMaterial: string;
  showMaterialSelector: boolean;
}

export interface MovimientoTypeIconProps {
  tipoMovimiento: MovimientoType;
  setTipoMovimiento: (tipo: MovimientoType) => void;
}

export interface MaterialSelectorProps {
  selectedMaterial: Material | null;
  showMaterialSelector: boolean;
  setShowMaterialSelector: (show: boolean) => void;
  materialesFiltrados: Material[];
  loadingMateriales: boolean;
  busquedaMaterial: string;
  setBusquedaMaterial: (value: string) => void;
  handleSelectMaterial: (material: Material) => void;
}

export interface CantidadControlProps {
  cantidad: number;
  selectedMaterial: Material | null;
  onCantidadChange: (delta: number) => void;
  onDirectCantidadChange: (cantidad: number) => void;
}

export interface DescripcionFieldProps {
  descripcion: string;
  onDescripcionChange: (descripcion: string) => void;
}