import type { Medidor } from "../models/Medidor";

export interface MedidorFilterOptions {
  estado?: number[];
  conAfiliado?: boolean;
  sinAfiliado?: boolean;
  searchTerm?: string;
}

export interface CreateMedidorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DetailMedidorModalProps {
  isOpen: boolean;
  onClose: () => void;
  medidor: Medidor;
}

export interface FilterMedidorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MedidorFilterOptions) => void;
  currentFilters: MedidorFilterOptions;
}

export interface CambiarEstadoMedidorModalProps {
  isOpen: boolean;
  onClose: () => void;
  medidor: Medidor;
}

export interface AsignarAfiliadoMedidorModalProps {
  isOpen: boolean;
  onClose: () => void;
  medidor: Medidor;
  onSuccess?: () => void;
}

export const NUMERO_MEDIDOR_MIN = 1;
export const NUMERO_MEDIDOR_MAX = 999999999;
