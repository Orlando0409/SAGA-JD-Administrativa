import React, { useState } from 'react';
import { useRoleById } from '../Hooks/RoleHook';
import { LuShield, LuUser, LuX } from 'react-icons/lu';
import { getLevelFromPermission } from '@/Modules/Usuarios/Helper/GroupPermiByModule';
import type { Permiso } from '@/Modules/Usuarios/Models/Usuario';
import { EditRoleModal } from './EditRolModal';
import type { RoleDetailModalProps } from '@/Modules/Usuarios/Types/UserTypes';


const RoleDetailModal: React.FC<RoleDetailModalProps> = ({ roleId, isOpen, onClose }) => {
  const { data: role, isLoading } = useRoleById(roleId);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen) return null;

  const getPermissionLabel = (permiso: Permiso) => {
    const level = getLevelFromPermission(permiso);
    switch (level) {
      case 'none': return { text: 'Sin acceso', className: 'bg-red-100 text-red-700' };
      case 'view': return { text: 'Solo ver', className: 'bg-yellow-100 text-yellow-700' };
      case 'edit': return { text: 'Ver y editar', className: 'bg-green-100 text-green-700' };
      default: return { text: 'Sin acceso', className: 'bg-red-100 text-red-700' };
    }
  };

  // Agrupar permisos por módulo
  const groupedPermisos = role?.permisos?.reduce((acc: any, permiso: Permiso) => {
    if (!acc[permiso.modulo]) {
      acc[permiso.modulo] = [];
    }
    acc[permiso.modulo].push(permiso);
    return acc;
  }, {});

  return (
    <>
      <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <LuShield className="w-7 h-7 text-blue-600" />
              Detalles del Rol
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Información básica del rol */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LuUser className="w-5 h-5 text-blue-600" />
                    Información del Rol
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">ID del Rol</label>
                      <p className="text-gray-900 font-medium">{role?.Id_Rol}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nombre del Rol</label>
                      <p className="text-gray-900 font-medium">{role?.Nombre_Rol}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Total de Permisos</label>
                      <p className="text-gray-900 font-medium">{role?.permisos?.length || 0} permisos asignados</p>
                    </div>
                  </div>
                </div>

                {/* Permisos por módulo */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LuShield className="w-5 h-5 text-blue-600" />
                    Permisos por Módulo
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(groupedPermisos || {}).map(([modulo, permisos]: [string, any]) => (
                      <div key={modulo} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <LuShield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg capitalize">{modulo}</h4>
                              <p className="text-sm text-gray-500">
                                {permisos.length} permiso(s) - Módulo del sistema
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {permisos.map((permiso: Permiso) => {
                              const label = getPermissionLabel(permiso);
                              return (
                                <div key={permiso.id} className="text-center">
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${label.className}`}>
                                    {label.text}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">ID: {permiso.id}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
      {/* Modal de edición */}
      {showEditModal && (
        <EditRoleModal
          roleId={roleId}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default RoleDetailModal;