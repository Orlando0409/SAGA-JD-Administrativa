import type { Material } from "../models/Inventario";

export interface MaterialDetailModalProps {
  materialId: number;
  isOpen: boolean;
  onClose: () => void;
}

export interface EditMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material;
}

export interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MaterialFilterOptions) => void;
  currentFilters: MaterialFilterOptions;
}

export interface MaterialFilterOptions {
  categoria?: string;
  estado?: string;
  conStock?: boolean;
  precioMin?: number;
  precioMax?: number;
  soloConCategorias?: boolean;
  soloSinCategorias?: boolean;
  stockMinimo?: number;
  stockMaximo?: number;
  tipoFiltroStock?: 'encima' | 'debajo' | 'entre';
}
export interface FilterMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MaterialFilterOptions) => void;
  currentFilters: MaterialFilterOptions;
}
export interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface EditMaterialModalProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
}
export interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NOMBRE_MATERIAL_MAX_LENGTH = 50;
export const DESCRIPCION_MAX_LENGTH = 200;
export const NOMBRE_CATEGORIA_MAX_LENGTH = 30;
export const PRECIO_MIN = 0.10;