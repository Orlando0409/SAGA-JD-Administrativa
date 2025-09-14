import { useAuthUser } from './AuthHook';

export const useUserPermissions = () => {
  const { user } = useAuthUser();

  const hasPermission = (modulo: string, action: 'ver' | 'editar') => {
    if (!user?.rol?.permisos) return false;

    const modulePermissions = user.rol.permisos.filter(
      permiso => permiso.modulo.toLowerCase() === modulo.toLowerCase()
    );

    if (modulePermissions.length === 0) return false;

    // Si requiere ver, cualquier permiso (Ver o Editar) es válido
    if (action === 'ver') {
      return modulePermissions.some(permiso => permiso.Ver || permiso.Editar);
    }

    // Si requiere editar, necesita específicamente el permiso de Editar
    if (action === 'editar') {
      return modulePermissions.some(permiso => permiso.Editar);
    }

    return false;
  };

  return {
    canView: (modulo: string) => hasPermission(modulo, 'ver'),
    canEdit: (modulo: string) => hasPermission(modulo, 'editar'),
    canCreate: (modulo: string) => hasPermission(modulo, 'editar'),
    canActivateDeactivate: (modulo: string) => hasPermission(modulo, 'editar'),
  };
};