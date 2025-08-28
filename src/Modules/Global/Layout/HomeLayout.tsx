import { ProtectedRoute } from './ProtectedRoutes'
import { AllowedModulesProvider } from '../../Auth/provider/PermisoProvider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '../components/Sidebar/ui/sidebar'
import { AppSidebar } from '../components/Sidebar/Sidebar'


export const HomeLayout = ({ children }: { children: (allowedModules: any) => React.ReactNode }) => {




  return (
    <ProtectedRoute>
      {(allowedModules) => (
        <AllowedModulesProvider allowedModules={allowedModules}>
          <SidebarProvider>
            <AppSidebar allowedModules={allowedModules} />
            <SidebarInset>
              <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
              <div className="flex flex-1 flex-col gap-4 p-4">
                {children(allowedModules)}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </AllowedModulesProvider>
      )}
    </ProtectedRoute>
  )
}