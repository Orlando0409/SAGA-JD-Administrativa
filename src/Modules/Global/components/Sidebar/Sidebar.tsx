import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar"
import { Link, useLocation } from '@tanstack/react-router'
import { useAuthUser, useLogout } from '../../../Auth/Hooks/AuthHook'
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react"
import { useState } from "react"
import { HiLogout } from 'react-icons/hi'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

const sections = [
  { id: 1, title: "Gestión", key: "Gestión" },
  { id: 2, title: "Edición", key: "Edición" },
  { id: 3, title: "Seguridad", key: "Seguridad" },
  { id: 4, title: "Ayuda", key: "Ayuda" }
]

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
}

type Module = {
  name: string
  path: string
  icon: React.ReactNode
  section: string
}

interface AppSidebarProps {
  allowedModules: Module[]
}

export function AppSidebar({allowedModules}: Readonly<AppSidebarProps>) {
  const [hovered, setHovered] = useState(false)
  const [openSections, setOpenSections] = useState<number[]>([])
  const location = useLocation()
  const logoutMutation = useLogout()
  const { state, setOpen: setSidebarOpen } = useSidebar()
  

  const { user, isLoading } = useAuthUser()
  const currentUser = {
    name: user?.Nombre_Usuario,
    email: user?.Correo_Electronico
  }

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logoutMutation.mutate()
  }

   const handleAccordion = (id: number) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    )
  }
  return (
    <section
          aria-hidden="true"
          className="relative"
          onMouseEnter={() => {
            setHovered(true)
            setSidebarOpen(true)
          }}
          onMouseLeave={() => {
            setHovered(false)
            setSidebarOpen(false)
          }}
        >
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="transition-all duration-300 z-40"
      >
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex flex-col items-center p-2">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center text-white font-bold">
              <img
                src="/Logo_ASADA_Juan_Díaz.png"
                alt="Logo"
                className="w-15 h-15 rounded-full group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
              />
            </div>
            <h2 className="font-bold text-2xl text-center text-sidebar-foreground mt-2 group-data-[collapsible=icon]:hidden">
              Panel Administrativo
            </h2>
          </div>
        </SidebarHeader>

     <SidebarContent>
          {/* Acordeón por sección */}
         {sections.map(section => {
           const isOpen = openSections.includes(section.id)
           return (
            <Accordion
               key={section.id}
               open={isOpen}
              animate={CUSTOM_ANIMATION}
              className="border-none shadow-none bg-transparent"
              {...({} as any)}

            >

            <AccordionHeader
              onClick={() => handleAccordion(section.id)}
              className="text-base font-semibold flex gap-10 p-3 items-center text-center py-1 group-data-[collapsible=icon]:hidden"
              {...({} as any)}
            >
              {section.title}
              <span className="pl-4">
                {isOpen ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
              </span>
            </AccordionHeader>
            <AccordionBody className="p-0" placeholder="">
              <ul>
                {allowedModules
                  .filter(mod => mod.section === section.key)
                  .map(mod => (
                    <li key={mod.name}>
                      <Link
                        to={mod.path}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors
                          ${isActive(mod.path)
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}
                        `}
                      >
                        <span className="w-6 h-6 flex items-center justify-center">{mod.icon}</span>
                        <span className="ml-2 group-data-[collapsible=icon]:hidden">{mod.name}</span>
                      </Link>
                          </li>
                        ))}
                        
                    </ul>
            </AccordionBody>
          </Accordion>
        )
      })}
    </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <div className="flex items-center space-x-3 p-2 group-data-[collapsible=icon]:justify-center">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              <>
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {(currentUser.name ? currentUser.name.toLocaleUpperCase().split(' ').map(n => n[0]).join('') : '')}
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{currentUser.email}</p>
                </div>
              </>
            )}
          </div>

          <SidebarSeparator />
          
          <ul>
            <li>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="flex items-center w-full px-4 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <HiLogout className="w-4 h-4" />
                <span className="ml-2 group-data-[collapsible=icon]:hidden">
                  {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
                </span>
              </button>
            </li>
          </ul>
        </SidebarFooter>
      </Sidebar>
    </section>
  )
}