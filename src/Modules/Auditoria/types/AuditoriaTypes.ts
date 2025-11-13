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
  mis_auditorias?: boolean;
  por_usuario?: number;
}

export interface DetailAuditoriaModalProps {
  auditoria: Auditoria | null;
  isOpen: boolean;
  onClose: () => void;
}

// Constantes para los filtros
export const MODULOS = [
  'Actas',
  'Calidad de Agua',
  'Categoria',
  'Edicion de imagenes',
  'FAQ',
  'Lecturas',
  'Login',
  'Logout',
  'Manuales de Usuario',
  'Material',
  'Medidores',
  'Movimientos',
  'Proveedores',
  'Proyectos',
  'Quejas',
  'Reportes',
  'Rol',
  'Solicitudes',
  'Sugerencias',
  'Unidad de Medicion',
  'Usuario',
] as const;

export const ACCIONES = [
  'Creación',
  'Actualización',
  'Eliminación',
] as const;
