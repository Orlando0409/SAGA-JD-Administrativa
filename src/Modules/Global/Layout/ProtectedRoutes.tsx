import { useAuth, useAuthUser } from '@/Modules/Auth/Hooks/AuthHook'
import { Navigate, useLocation } from '@tanstack/react-router'
import { modules } from '../components/DashboardGlobal/ModulosData'


interface ProtectedRouteProps {
  children: (allowedModules: typeof modules) => React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { user, isLoading } = useAuthUser()
  const location = useLocation()
  const currentPath = location.pathname

  // Muestra loader mientras carga
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    )
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/Login" />
  }

  const userPermisos = user?.rol?.permisos ?? []

  // Filtra los módulos permitidos según los permisos del usuario
  const allowedModules = modules.filter(mod => {
    const permiso = userPermisos.find(p => p.modulo === mod.permiso)
    return permiso && permiso.Ver === true
  })

  // Rutas que siempre están permitidas (Home)
  const alwaysAllowedRoutes = ['/Home']
  const isAlwaysAllowed = alwaysAllowedRoutes.some(route => 
    normalizePath(currentPath) === normalizePath(route)
  )

  // Verifica si tiene permiso para la ruta actual
  const hasPermissionForCurrentRoute = isAlwaysAllowed || 
    allowedModules.some(mod => normalizePath(mod.path) === normalizePath(currentPath))

  // Si no tiene permiso para esta ruta específica, redirige
  if (!hasPermissionForCurrentRoute) {
    return <Navigate to="/Unauthorized" />
  }

  // Pasa los módulos permitidos a los hijos
  return <>{children(allowedModules)}</>
}

function normalizePath(path: string) {
  return path.replace(/^\/+|\/+$/g, '').toLowerCase();
}