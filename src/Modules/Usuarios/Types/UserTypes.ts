import type { Usuario } from "../Models/Usuario";

export type FechaEliminacionType = Date | string | null | undefined;
export interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}
export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario;
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  rol?: string;
  estado?: 'activo' | 'inactivo' | '';
}

export type CreateUserProps = {
  onClose?: () => void;
  setShowCreateModal?: (show: boolean) => void;
};

// Constantes para validación
export const NOMBRE_MAX_LENGTH = 20;
export const EMAIL_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;