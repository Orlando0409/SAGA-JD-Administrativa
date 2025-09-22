// src/Modules/Global/Layout/ProtectedRoutes.tsx
import { useAuth } from '@/Modules/Auth/Context/AuthContext';
import { cookieUtils } from '../utils/CookieUtils';
import { Navigate } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { modules } from '../components/DashboardGlobal/ModulosData';

interface ProtectedRouteProps {
  children: (allowedModules: any[]) => ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    cookieUtils.removeToken();
    return <Navigate to="/Login" replace />;
  }

  const allowedModules = modules.filter(module => {
    const hasPermission = user.rol?.permisos?.some(p => 
      p.modulo.toLowerCase() === module.permiso.toLowerCase() && (p.Ver || p.Editar)
    );
    return hasPermission;
  });

  return <>{children(allowedModules)}</>;
};