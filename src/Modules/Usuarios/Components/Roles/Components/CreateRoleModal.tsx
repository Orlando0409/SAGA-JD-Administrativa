import React, { useState } from 'react';
import { useCreateRole, usePermissions } from '../Hooks/RoleHook';
import { LuShield, LuX } from 'react-icons/lu';
import { groupPermissionsByModule, getPermissionIdByLevel } from '@/Modules/Usuarios/Helper/GroupPermiByModule';
import type { ModulePermission, PermissionLevel } from '@/Modules/Usuarios/Types/UserTypes';

interface CreateRoleModalProps {
  onClose: () => void;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ onClose }) => {
  const [nombreRol, setNombreRol] = useState('');
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
  const { data: permisos = [], isLoading } = usePermissions();
  const { mutate: createRole } = useCreateRole();

  // Inicializar permisos por módulo cuando se cargan los permisos
  React.useEffect(() => {
    if (permisos.length > 0) {
      const moduleGroups = groupPermissionsByModule(permisos);
      const initialState = Object.keys(moduleGroups).map(modulo => ({
        modulo,
        level: 'none' as PermissionLevel,
        selectedId: getPermissionIdByLevel(moduleGroups[modulo], 'none')
      }));
      setModulePermissions(initialState);
    }
  }, [permisos]);

  const handlePermissionChange = (modulo: string, level: PermissionLevel) => {
    const moduleGroups = groupPermissionsByModule(permisos);
    const newId = getPermissionIdByLevel(moduleGroups[modulo], level);
    
    setModulePermissions(prev =>
      prev.map(mp =>
        mp.modulo === modulo ? { ...mp, level, selectedId: newId } : mp
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo envía los IDs de permisos que no son 'none'
    const permisosIds = modulePermissions
      .filter(mp => mp.level !== 'none')
      .map(mp => mp.selectedId);
    
    createRole({ Nombre_Rol: nombreRol, permisosIds });
    onClose();
  };

  // Verificar si el módulo tiene permiso de editar disponible
  const hasEditPermission = (modulo: string) => {
    return modulo !== 'bitacora';
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Rol</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Rol</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    value={nombreRol}
                    onChange={e => setNombreRol(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre del rol"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Total de Módulos
                  </label>
                  <p className="text-gray-900 font-medium py-2">
                    {modulePermissions.length} módulos disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* Permisos por módulo */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LuShield className="w-5 h-5 text-blue-600" />
                Permisos por Módulo ({modulePermissions.length})
              </h3>
              
              {isLoading ? (
                <div className="text-center py-8">Cargando permisos...</div>
              ) : (
                <div className="space-y-4">
                  {modulePermissions.map((mp) => (
                    <div key={mp.modulo} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <LuShield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg capitalize">{mp.modulo}</h4>
                            <p className="text-sm text-gray-500">
                              {hasEditPermission(mp.modulo) ? 'Módulo del sistema' : 'Solo lectura disponible'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          {/* Toggle Ver */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ver</span>
                            <label className="cursor-pointer">
                              <input
                                type="checkbox"
                                checked={mp.level === 'view' || mp.level === 'edit'}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // Si no tiene permiso de editar o ya está en edit, solo activar view
                                    if (!hasEditPermission(mp.modulo) || mp.level !== 'edit') {
                                      handlePermissionChange(mp.modulo, 'view');
                                    }
                                  } else {
                                    handlePermissionChange(mp.modulo, 'none');
                                  }
                                }}
                                className="sr-only"
                              />
                              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                (mp.level === 'view' || mp.level === 'edit') ? 'bg-green-500' : 'bg-red-400'
                              }`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  (mp.level === 'view' || mp.level === 'edit') ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </div>
                            </label>
                          </div>

                          {/* Toggle Editar */}
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Editar</span>
                            <label className={`cursor-pointer ${!hasEditPermission(mp.modulo) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <input
                                type="checkbox"
                                checked={mp.level === 'edit'}
                                onChange={(e) => {
                                  if (hasEditPermission(mp.modulo)) {
                                    if (e.target.checked) {
                                      handlePermissionChange(mp.modulo, 'edit');
                                    } else {
                                      // Si desactiva editar pero ver está activo, mantener view
                                      if (mp.level === 'edit') {
                                        handlePermissionChange(mp.modulo, 'view');
                                      }
                                    }
                                  }
                                }}
                                disabled={!hasEditPermission(mp.modulo)}
                                className="sr-only"
                              />
                              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                mp.level === 'edit' ? 'bg-green-500' : 'bg-red-400'
                              }`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  mp.level === 'edit' ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Crear Rol
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;