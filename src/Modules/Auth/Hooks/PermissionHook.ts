import { useAuth } from '../Context/AuthContext';

export const useUserPermissions = () => {
  const { user, isLoading } = useAuth();

  const hasPermission = (modulo: string, action: 'ver' | 'editar') => {
    if (isLoading || !user?.rol?.permisos) return false;

    const modulePermissions = user.rol.permisos.filter(
      permiso => permiso.modulo.toLowerCase() === modulo.toLowerCase()
    );

    if (modulePermissions.length === 0) return false;

    if (action === 'ver') {
      return modulePermissions.some(permiso => permiso.Ver || permiso.Editar);
    }

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
    isLoading,
    user
  };
};