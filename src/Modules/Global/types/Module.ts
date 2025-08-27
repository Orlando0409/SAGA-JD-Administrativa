
export interface Module {
  name: string;
  icon: React.ReactElement;
  path: string;
  section: string;
  permiso: string;
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