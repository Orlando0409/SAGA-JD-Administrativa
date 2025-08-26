import { Navigate } from '@tanstack/react-router'
import { useAuth, useAuthUser } from '../../Auth/Hooks/AuthHook'
import { modules } from '../components/DashboardGlobal/ModulosData'

interface ProtectedRouteProps {
  children: (allowedModules: typeof modules) => React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth()
  const { user } = useAuthUser()
  const userPermisos = user?.rol?.permisos ?? []

  // Filtra los módulos permitidos
  const allowedModules = modules.filter(mod => {
    const permiso = userPermisos.find(p => p.modulo === mod.permiso)
    return permiso && permiso.Ver === true
  })
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" />
  }

  // Pasa los módulos permitidos a los hijos
  return <>{children(allowedModules)}</>
}