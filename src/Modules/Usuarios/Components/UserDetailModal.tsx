import { useState } from 'react';
import { LuX, LuUserX, LuUser, LuShield, LuUserCheck } from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { useUser, useDeactivateUser, useActivateUser } from '../Hooks/userHook';
import EditUserModal from './EditUserModal';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter
} from "@/Modules/Global/components/Sidebar/ui/alert-dialog";
import { Button } from '@/Modules/Global/components/Sidebar/ui/button';
import type { UserDetailModalProps } from '../Types/UserTypes';
import type { Permiso } from '../../Roles/Models/Role';
import { getPermissionLabel } from '../Helper/GroupPermiByModule';
import { isActive } from '../Helper/utils';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';



const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, isOpen, onClose }) => {
  const { data: user, isLoading } = useUser(userId);
  const { canEdit, canActivateDeactivate } = useUserPermissions();
  const deactivateUserMutation = useDeactivateUser();
  const activateUserMutation = useActivateUser();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeactivate = async () => {
    try {
      await deactivateUserMutation.mutateAsync(userId);
      onClose(); // Cerrar el modal después de desactivar
    } catch (error) {
      console.error('Error deactivating user:', error);
    }

  };

  const handleActivate = async () => {

    try {
      await activateUserMutation.mutateAsync(userId);
      onClose(); // Cerrar el modal después de activar
    } catch (error) {
      console.error('Error activating user:', error);
    }

  };




  const getStatusDisplay = (Fecha_Eliminacion: Date | string | null) => {
    return isActive(Fecha_Eliminacion) ? 'Activo' : 'Inactivo';
  };

  // Agrupar permisos por módulo
  const groupedPermisos = user?.Rol.Permisos?.reduce((acc: Record<string, Permiso[]>, permiso: Permiso) => {
    if (!acc[permiso.Modulo]) {
      acc[permiso.Modulo] = [];
    }
    acc[permiso.Modulo].push(permiso);
    return acc;
  }, {});

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Usuario no encontrado</h2>
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Usuario</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Header Card del Usuario */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-xl mb-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <LuUser className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{user.Nombre_Usuario}</h2>
                <p className="text-blue-100 text-lg">{user.Correo_Electronico}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Información Personal */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                    <LuUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Columna izquierda */}
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Nombre Completo
                      </label>
                      <p className="text-lg font-medium text-gray-900">{user.Nombre_Usuario}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Estado del Usuario
                      </label>
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-semibold shadow-sm ${isActive(user.Fecha_Eliminacion)
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {getStatusDisplay(user.Fecha_Eliminacion)}
                      </span>
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Correo Electrónico
                      </label>
                      <p className="text-lg text-gray-900 break-all">{user.Correo_Electronico}</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                      <label className="block text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Rol Asignado
                      </label>
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-base font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                        <LuShield className="w-5 h-5 mr-3" />
                        {user.Rol?.Nombre_Rol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permisos del Rol */}
            {user.Rol?.Permisos && user.Rol.Permisos.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                      <LuShield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Permisos del Rol ({user.Rol.Permisos.length})
                    </h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {Object.entries(groupedPermisos || {}).map(([modulo, permisos]: [string, any]) => (
                      <div key={modulo} className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-all">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                              <LuShield className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg capitalize">{modulo}</h4>
                              <p className="text-sm text-gray-600 mt-1">{permisos.length} permiso{permisos.length !== 1 ? 's' : ''} asignado{permisos.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            {permisos.map((permiso: Permiso) => {
                              const label = getPermissionLabel(permiso);
                              return (
                                <span key={permiso.Id} className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border ${label.className}`}>
                                  {label.text}
                                </span>
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

          {/* Botones de Acción */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {canEdit('usuarios') && (
                <Button
                  size="xl"
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-3 font-semibold"
                  onClick={() => setShowEditModal(true)}
                >
                  <FaUserEdit className="w-5 h-5" />
                  Editar Usuario
                </Button>
              )}

              {canActivateDeactivate('usuarios') && (
                <>
                  {isActive(user.Fecha_Eliminacion) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='destructive'
                          size={'xl'}
                          className="px-8 py-4 rounded-xl shadow-md hover:shadow-lg font-semibold"
                        >
                          <LuUserX className="w-5 h-5" />
                          <span className="ml-3">Desactivar Usuario</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Desactivar usuario?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas desactivar este usuario?</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={handleDeactivate}
                            disabled={deactivateUserMutation.isPending}
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
                          className="px-8 py-4 rounded-xl shadow-md hover:shadow-lg font-semibold"
                        >
                          <LuUserCheck className="w-5 h-5" />
                          <span className="ml-3">Activar Usuario</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            <span>¿Activar usuario?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            <span>¿Estás seguro de que deseas activar este usuario?</span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            onClick={handleActivate}
                            disabled={activateUserMutation.isPending}
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

        {showEditModal && (
          <EditUserModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              onClose();
            }}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;