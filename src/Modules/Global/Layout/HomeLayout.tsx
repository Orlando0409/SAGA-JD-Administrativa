// src/Modules/Global/Layout/HomeLayout.tsx
import { AllowedModulesProvider } from '@/Modules/Auth/provider/PermisoProvider'
import { AppSidebar } from '../components/Sidebar/Sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '../components/Sidebar/ui/sidebar'
import { ProtectedRoute } from './ProtectedRoutes'
import { useState } from 'react'
import type { NotificacionSolicitud } from '@/Modules/Solicitudes/Hooks/HookNotificaciones'
import ModalSolicitud from '@/Modules/Solicitudes/components/ModalSolicitud'
import { BuzonNotificaciones } from '@/Modules/Solicitudes/components/BuzonNotificaciones'
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook'

export const HomeLayout = ({ children }: { children: (allowedModules: any) => React.ReactNode }) => {
  const [showModalSolicitud, setShowModalSolicitud] = useState(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState<NotificacionSolicitud | null>(null);
  const { canView } = useUserPermissions();
  const handleVerSolicitud = (notificacion: NotificacionSolicitud) => {
    setSelectedNotificacion(notificacion);
    setShowModalSolicitud(true);
  };

  return (
    <ProtectedRoute>
      {(allowedModules) => (
        <AllowedModulesProvider allowedModules={allowedModules}>
          <SidebarProvider>
            <AppSidebar allowedModules={allowedModules} />
            <SidebarInset className="h-screen overflow-hidden"> 
                {canView('Solicitudes') && ( 
                   <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
                     <SidebarTrigger className="md:hidden" />
                     <div className="ml-auto">
                       <BuzonNotificaciones onVerSolicitud={handleVerSolicitud} />
                     </div>
                   </header>
                 )}

              <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)]"> 
                <div className="p-4">
                  {children(allowedModules)}
                </div>
              </main>
            </SidebarInset>
          </SidebarProvider>

          {showModalSolicitud && selectedNotificacion && (
            <ModalSolicitud
              isOpen={showModalSolicitud}
              onClose={() => {
                setShowModalSolicitud(false);
                setSelectedNotificacion(null);
              }}
              solicitud={{
                tipo: selectedNotificacion.tipo === 'fisica' ? 'solicitud-fisica' : 'solicitud-juridica',
                datos: selectedNotificacion.solicitudOriginal
              }}
            />
          )}
        </AllowedModulesProvider>
      )}
    </ProtectedRoute>
  )
}