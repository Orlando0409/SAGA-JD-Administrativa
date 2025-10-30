import type { Auditoria } from '../models/Auditoria';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AuditoriaFilterOptions) => void;
  currentFilters: AuditoriaFilterOptions;
}

export interface AuditoriaFilterOptions {
  modulo?: string;
  accion?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface DetailAuditoriaModalProps {
  auditoria: Auditoria | null;
  isOpen: boolean;
  onClose: () => void;
}

// Constantes para los filtros
export const MODULOS = [
  'Unidad de Medicion',
  'Categoria',
  'Material',
  'Medidor',
  'Calidad de Agua',
  'Proveedor'
] as const;

export const ACCIONES = [
  'Creación',
  'Actualización',
  'Activación',
  'Desactivación',
] as const;
