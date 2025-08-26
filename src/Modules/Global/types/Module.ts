
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
