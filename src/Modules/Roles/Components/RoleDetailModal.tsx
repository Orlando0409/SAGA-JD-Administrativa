import React, { useState } from 'react';
import { useActivateRole, useDeactivateRole, useRoleById } from '../Hooks/RoleHook';
import { LuShield, LuUser, LuUserCheck, LuUserX, LuX } from 'react-icons/lu';
import type { Permiso } from '@/Modules/Roles/Models/Role';

import { getPermissionLabel } from '@/Modules/Usuarios/Helper/GroupPermiByModule';
import type { RoleDetailModalProps } from '../Types/RoleTypes';
import { EditRoleModal } from './EditRolModal';
import { isActive } from '@/Modules/Usuarios/Helper/utils';
import type { FechaEliminacionType } from '@/Modules/Usuarios/Types/UserTypes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Modules/Global/components/Sidebar/ui/alert-dialog';
import { Button } from '@/Modules/Global/components/Sidebar/ui/button';
import { FaUserEdit } from 'react-icons/fa';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';


const RoleDetailModal: React.FC<RoleDetailModalProps> = ({ roleId, isOpen, onClose }) => {
  const { data: role, isLoading } = useRoleById(roleId);
  const { canEdit, canActivateDeactivate } = useUserPermissions();
  const [showEditModal, setShowEditModal] = useState(false);
  const deactivateRoleMutation = useDeactivateRole();
  const activateRoleMutation = useActivateRole();

    const handleDeactivate = async () => {
      try {
        await deactivateRoleMutation.mutateAsync(roleId);
      } catch (error) {
        console.error('Error deactivating role:', error);
      }
    
  };

  const handleActivate = async () => {
   
      try {
        await activateRoleMutation.mutateAsync(roleId);
      } catch (error) {
        console.error('Error activating role:', error);
      }
    
  };

    const getStatusDisplay = (Fecha_Eliminacion: FechaEliminacionType | undefined) => {
      if (Fecha_Eliminacion === undefined) return 'Desconocido';
      return isActive(Fecha_Eliminacion) ? 'Activo' : 'Inactivo';
    };


  if (!isOpen) return null;

  // Agrupar permisos por módulo
  const groupedPermisos = role?.Permisos?.reduce((acc: any, permiso: Permiso) => {
    if (!acc[permiso.Modulo]) {
      acc[permiso.Modulo] = [];
    }
    acc[permiso.Modulo].push(permiso);
    return acc;
  }, {});


  return (
    <>
      <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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

          <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-140px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LuUser className="w-5 h-5 text-blue-600" />
                    Información del Rol
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor='role-name' className="block text-sm font-medium text-gray-500 mb-1">Nombre del Rol</label>
                      <p className="text-gray-900 font-medium">{role?.Nombre_Rol}</p>
                    </div>
                    <div>
                      <label htmlFor='role-permissions' className="block text-sm font-medium text-gray-500 mb-1">Total de Permisos</label>
                      <p className="text-gray-900 font-medium">{role?.Permisos?.length || 0} permisos asignados</p>
                    </div>
                    <div>
                      <label htmlFor='role-status' className="block text-sm font-medium text-gray-500 mb-2">Estado del Rol</label>
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${
                        isActive(role?.Fecha_Eliminacion)
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {getStatusDisplay(role?.Fecha_Eliminacion)}
                      </span>
                    </div>
                  </div>
                </div>

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
                                <div key={permiso.Id} className="text-center">
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${label.className}`}>
                                    {label.text}
                                  </div>
                                
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
          
          <div className="flex justify-end gap-4 mt-8">
            {canEdit('usuarios') && (
              <Button
                size="xl"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                onClick={() => setShowEditModal(true)}
              >
                <FaUserEdit className="w-5 h-5" />
                Editar rol
              </Button>
            )}

            {canActivateDeactivate('usuarios') && (
              <>
                {isActive(role?.Fecha_Eliminacion) ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        size={'xl'}
                      >
                        <LuUserX className="w-5 h-5" />
                        <span className="ml-2">Desactivar rol</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          <span>¿Desactivar rol?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <span>¿Estás seguro de que deseas desactivar este rol?</span>
                          <span>Si lo haces, se desactivarán los usuarios con este rol!</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={handleDeactivate}
                          disabled={deactivateRoleMutation.isPending}
                        >
                          <span>Desactivar</span>
                        </AlertDialogAction>
                        <AlertDialogCancel>
                          <span>Cancelar</span>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='create'
                        size={'xl'}
                      >
                        <LuUserCheck className="w-5 h-5" />
                        <span className="ml-2">Activar rol</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          <span>¿Activar rol?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <span>¿Estás seguro de que deseas activar este rol?</span>
                          <span>Si lo haces, se activarán los usuarios con este rol!</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={handleActivate}
                          disabled={activateRoleMutation.isPending}
                        >
                          <span>Activar</span>
                        </AlertDialogAction>
                        <AlertDialogCancel>
                          <span>Cancelar</span>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </div>
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