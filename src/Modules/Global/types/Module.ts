
export interface Module {
  name: string;
  icon: React.ReactElement;
  path: string;
  section?: string; // Opcional para módulos que no aparecen en secciones
  permiso: string;
  hidden?: boolean; // Ocultar del dashboard pero permitir acceso directo
}

export interface AllowedModulesContextProps {
  allowedModules: Module[]
}

export interface SidebarModule {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export interface SidebarSectionProps {
  section: { id: string | number; title: string };
  isOpen: boolean;
  onToggle: (id: string | number) => void;
  modules: SidebarModule[];
  isActive: (path: string) => boolean;
}