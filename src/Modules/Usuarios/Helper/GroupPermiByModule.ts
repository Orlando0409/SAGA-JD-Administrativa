import type { Permiso } from "../../Roles/Models/Role";

// Tipos para los radio buttons
export type PermissionLevel = 'none' | 'view' | 'edit';

export interface ModulePermission {
  Modulo: string;
  level: PermissionLevel;
  selectedId: number;
}



// Agrupa permisos por módulo y devuelve las opciones disponibles
export const groupPermissionsByModule = (permisos: Permiso[]) => {
  const modules: { [key: string]: Permiso[] } = {};
  
  permisos.forEach(permiso => {
    if (!modules[permiso.Modulo]) {
      modules[permiso.Modulo] = [];
    }
    modules[permiso.Modulo].push(permiso);
  });
  
  return modules;
};

// Encuentra el ID del permiso según el nivel deseado
export const getPermissionIdByLevel = (modulePermisos: Permiso[], level: PermissionLevel): number => {
  const permiso = modulePermisos.find(p => {
    switch (level) {
      case 'none': return p.Ver === false && p.Editar === false;
      case 'view': return p.Ver === true && p.Editar === false;
      case 'edit': return p.Ver === true && p.Editar === true;
      default: return false;
    }
  });
  return permiso?.Id || modulePermisos[0]?.Id;
};

// Determina el nivel actual basado en un permiso
export const getLevelFromPermission = (permiso: Permiso): PermissionLevel => {
  if (permiso.Ver === false && permiso.Editar === false) return 'none';
  if (permiso.Ver === true && permiso.Editar === false) return 'view';
  if (permiso.Ver === true && permiso.Editar === true) return 'edit';
  return 'none';
};

// Convierte permisos del rol a estado para los radio buttons
export const convertRolePermissionsToModuleState = (
  rolePermisos: Permiso[], 
  allPermisos: Permiso[]
): ModulePermission[] => {
  const moduleGroups = groupPermissionsByModule(allPermisos);
  const result: ModulePermission[] = [];
  
  Object.keys(moduleGroups).forEach(modulo => {
    const modulePermisos = moduleGroups[modulo];
    const activePermiso = rolePermisos.find(rp => rp.Modulo === modulo);
    
    if (activePermiso) {
      result.push({
        Modulo: modulo,
        level: getLevelFromPermission(activePermiso),
        selectedId: activePermiso.Id
      });
    } else {
      // Default a 'none' si no hay permiso asignado
      result.push({
        Modulo: modulo,
        level: 'none',
        selectedId: getPermissionIdByLevel(modulePermisos, 'none')
      });
    }
  });
  
  return result;
};


  export const getPermissionLabel = (permiso: Permiso) => {
    const level = getLevelFromPermission(permiso);
    switch (level) {
      case 'none': return { text: 'Sin acceso', className: 'bg-red-100 text-red-700' };
      case 'view': return { text: 'Solo ver', className: 'bg-yellow-100 text-yellow-700' };
      case 'edit': return { text: 'Ver y editar', className: 'bg-green-100 text-green-700' };
      default: return { text: 'Sin acceso', className: 'bg-red-100 text-red-700' };
    }
  };

