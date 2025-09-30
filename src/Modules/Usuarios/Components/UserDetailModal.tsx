import { useState } from 'react';
import { LuX, LuUserX, LuMail, LuUser, LuShield, LuUserCheck } from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { useUser, useDeactivateUser, useActivateUser } from '../Hooks/userHook';
import EditUserModal from './EditUserModal';
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react"
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
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
import { CUSTOM_ANIMATION } from '@/Modules/Global/types/Sections';
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
  const [openSections, setOpenSections] = useState<number[]>([1, 2, 3]); // Abrir por defecto

  const handleDeactivate = async () => {
      try {
        await deactivateUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    
  };

  const handleActivate = async () => {
   
      try {
        await activateUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Error activating user:', error);
      }
    
  };

  const handleAccordion = (id: number) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    )
  }


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
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Usuario</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <LuUser className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user.Nombre_Usuario}</h2>
                <p className="text-blue-100">{user.Correo_Electronico}</p>
              </div>
            </div>
          </div>


          <div className="space-y-4">
            <Accordion
              open={openSections.includes(1)}
              animate={CUSTOM_ANIMATION}
              className="border border-gray-200 rounded-lg shadow-sm bg-white"
              {...({} as any)}
            >
              <AccordionHeader
                onClick={() => handleAccordion(1)}
                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                {...({} as any)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <LuUser className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Información Básica</span>
                  </div>
                  <span className="text-gray-500">
                    {openSections.includes(1) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody className="px-6 pb-6" placeholder="">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-500 mb-1"
                        id="nombre-usuario-label"
                        htmlFor="nombre-usuario"
                      >
                        Nombre de Usuario
                      </label>
                      <p
                        className="text-gray-900 font-medium"
                        id="nombre-usuario"
                        aria-labelledby="nombre-usuario-label"
                      >
                        {user.Nombre_Usuario}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LuMail className="w-4 h-4 text-gray-400" />
                      <div>
                        <label htmlFor="correo-electronico" className="block text-sm font-medium text-gray-500 mb-1">Correo Electrónico</label>
                        <p className="text-gray-900 font-medium">{user.Correo_Electronico}</p>
                      </div>
                    </div>
                  </div>
                    <div className="space-y-4">
                      <div>
                      <label htmlFor="estado-usuario" className="block text-sm font-medium text-gray-500 mb-2">Estado del Usuario</label>
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${
                        isActive(user.Fecha_Eliminacion)
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {getStatusDisplay(user.Fecha_Eliminacion)}
                      </span>
                    </div>
                    </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="rol-asignado" className="block text-sm font-medium text-gray-500 mb-2">Rol Asignado</label>
                      <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <LuShield className="w-4 h-4 mr-2" />
                        {user.Rol?.Nombre_Rol}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionBody>
            </Accordion>

            {/* Permisos */}
            {user.Rol?.Permisos && user.Rol.Permisos.length > 0 && (
              <Accordion
                open={openSections.includes(3)}
                animate={CUSTOM_ANIMATION}
                className="border border-gray-200 rounded-lg shadow-sm bg-white "
                {...({} as any)}
              >
                <AccordionHeader
                  onClick={() => handleAccordion(3)}
                  className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                  {...({} as any)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <LuShield className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-900">
                        Permisos del Rol ({user.Rol.Permisos.length})
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {openSections.includes(3) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                    </span>
                  </div> 
                </AccordionHeader>
                <AccordionBody className="px-6 pb-6 " placeholder="">
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
                </AccordionBody>
              </Accordion>
            )}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            {canEdit('usuarios') && (
              <Button
                size="xl"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
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
                  >
                    <LuUserX className="w-5 h-5" />
                    <span className="ml-2">Desactivar Usuario</span>
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
                  >
                    <LuUserCheck className="w-5 h-5" />
                    <span className="ml-2">Activar Usuario</span>
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

        {showEditModal && (
          <EditUserModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={user}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;