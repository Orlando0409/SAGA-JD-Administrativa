export const sections = [
  { id: 1, title: "Gestión", key: "Gestión" },
  { id: 2, title: "Edición", key: "Edición" },
  { id: 3, title: "Seguridad", key: "Seguridad" },
  { id: 4, title: "Ayuda", key: "Ayuda" }
]

export const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
}

export type Module = {
  name: string
  path: string
  icon: React.ReactNode
  section: string
}

export interface AppSidebarProps {
  allowedModules: Module[]
}