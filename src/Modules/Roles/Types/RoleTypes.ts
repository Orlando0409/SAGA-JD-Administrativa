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
export interface CreateRoleModalProps {
  onClose: () => void;
}


export const RoleMIN_LENGTH = 5;
export const RoleMAX_LENGTH = 30;