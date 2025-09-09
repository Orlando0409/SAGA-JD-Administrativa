import type { Permiso } from "../Models/Usuario";
import type { ModulePermission, PermissionLevel } from "../Types/UserTypes";


// Agrupa permisos por módulo y devuelve las opciones disponibles
export const groupPermissionsByModule = (permisos: Permiso[]) => {
  const modules: { [key: string]: Permiso[] } = {};
  
  permisos.forEach(permiso => {
    if (!modules[permiso.modulo]) {
      modules[permiso.modulo] = [];
    }
    modules[permiso.modulo].push(permiso);
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
  return permiso?.id || modulePermisos[0]?.id;
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
    const activePermiso = rolePermisos.find(rp => rp.modulo === modulo);
    
    if (activePermiso) {
      result.push({
        modulo,
        level: getLevelFromPermission(activePermiso),
        selectedId: activePermiso.id
      });
    } else {
      // Default a 'none' si no hay permiso asignado
      result.push({
        modulo,
        level: 'none',
        selectedId: getPermissionIdByLevel(modulePermisos, 'none')
      });
    }
  });
  
  return result;
};