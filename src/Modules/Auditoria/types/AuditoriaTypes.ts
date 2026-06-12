import type { Auditoria } from '../models/Auditoria';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AuditoriaFilterOptions) => void;
  currentFilters: AuditoriaFilterOptions;
  // Opciones derivadas de los datos reales de auditoría (nunca se desincronizan del backend)
  modulos: string[];
  acciones: string[];
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
