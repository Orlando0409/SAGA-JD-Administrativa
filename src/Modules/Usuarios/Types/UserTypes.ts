export type FechaEliminacionType = Date | string | null;

// Tipos para los radio buttons
export type PermissionLevel = 'none' | 'view' | 'edit';

export interface ModulePermission {
  modulo: string;
  level: PermissionLevel;
  selectedId: number;
}
export interface EditRoleModalProps {
  roleId: number;
  isOpen: boolean;
  onClose: () => void;
}
export type RoleDetailModalProps = {
  roleId: number;
  isOpen: boolean;
  onClose: () => void;
};
