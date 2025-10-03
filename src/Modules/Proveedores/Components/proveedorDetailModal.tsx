import React, { useState } from 'react';
import { LuX, LuUserX, LuPhone, LuBuilding2, LuUserCheck, LuCalendar, LuIdCard , LuUserRound} from 'react-icons/lu';
import { FaUserEdit } from "react-icons/fa";
import { useProveedoresFisicos, useDeleteProveedorFisico } from '../Hook/proveedoresFisicos';
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import EditProveedorModal from './EditProveedoresModal';
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
import type { ProveedorFisico } from '../Models/TablaProveedo/proveedorFisico';

interface ProveedorDetailModalProps {
  proveedor: ProveedorFisico | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProveedorDetailModal: React.FC<ProveedorDetailModalProps> = ({ proveedor, isOpen, onClose }) => {
  const { refetch } = useProveedoresFisicos();
  const { deleteProveedorFisico, isDeleting } = useDeleteProveedorFisico();
  const [showEditModal, setShowEditModal] = useState(false);
  const [openSections, setOpenSections] = useState<number[]>([1, 2]); // Abrir por defecto
  const [isActivating, setIsActivating] = useState(false);

  const handleDeactivate = async () => {
    if (!proveedor?.Id_Proveedor) {
      console.error('No se puede eliminar: ID del proveedor no encontrado');
      return;
    }

    try {
      await deleteProveedorFisico(proveedor.Id_Proveedor);
      alert('Proveedor eliminado exitosamente');
      onClose(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar el proveedor';
      alert(`Error al eliminar el proveedor: ${errorMessage}`);
    }
  };

  const handleActivate = async () => {
    setIsActivating(true);
    try {
      // TODO: Implementar servicio de activación
      console.log('Activar proveedor:', proveedor?.Id_Proveedor);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      refetch(); // Actualizar datos
    } catch (error) {
      console.error('Error activating proveedor:', error);
    } finally {
      setIsActivating(false);
    }
  };

  const handleAccordion = (id: number) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Sin fecha';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const getStatusDisplay = (estado: any) => {
    const estadoNombre = estado?.Estado_Proveedor || 'Sin estado';
    return estadoNombre;
  };

  const isActiveProveedor = (estado: any) => {
    const estadoNombre = estado?.Estado_Proveedor || '';
    return estadoNombre.toLowerCase() === 'activo';
  };

  if (!isOpen || !proveedor) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Proveedor</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Proveedor Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <LuBuilding2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{proveedor.Nombre_Proveedor}</h2>
                <p className="text-blue-100">{proveedor.Tipo_Identificacion}: {proveedor.Identificacion}</p>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {/* Información Básica */}
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
                    <LuBuilding2 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Información Básica</span>
                  </div>
                  <span className="text-gray-500">
                    {openSections.includes(1) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody className="px-6 pb-6" placeholder="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LuUserRound className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nombre del Proveedor</label>
                        <p className="text-gray-900 font-medium">{proveedor.Nombre_Proveedor || 'Sin nombre'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuIdCard className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Identificación</label>
                        <p className="text-gray-900 font-medium">{proveedor.Identificacion || 'Sin identificación'}</p>
                        <p className="text-xs text-gray-500">{proveedor.Tipo_Identificacion || 'Sin tipo'}</p>
                      </div>
                    </div>

                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LuPhone className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
                        <p className="text-gray-900 font-medium">{proveedor.Telefono_Proveedor || 'Sin teléfono'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">Estado del Proveedor</label>
                      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${
                        isActiveProveedor(proveedor.Estado_Proveedor)
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {getStatusDisplay(proveedor.Estado_Proveedor)}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionBody>
            </Accordion>

            {/* Información de Fechas */}
            <Accordion
              open={openSections.includes(2)}
              animate={CUSTOM_ANIMATION}
              className="border border-gray-200 rounded-lg shadow-sm bg-white"
              {...({} as any)}
            >
              <AccordionHeader
                onClick={() => handleAccordion(2)}
                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                {...({} as any)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <LuCalendar className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Información de Fechas</span>
                  </div>
                  <span className="text-gray-500">
                    {openSections.includes(2) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody className="px-6 pb-6" placeholder="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LuCalendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Creación</label>
                        <p className="text-gray-900 font-medium">{formatDate(proveedor.Fecha_Creacion)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <LuCalendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
                        <p className="text-gray-900 font-medium">{formatDate(proveedor.Fecha_Actualizacion)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionBody>
            </Accordion>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              size="xl"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              onClick={() => setShowEditModal(true)}
            >
              <FaUserEdit className="w-5 h-5" />
              Editar Proveedor
            </Button>

            {isActiveProveedor(proveedor.Estado_Proveedor) ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='destructive'
                    size={'xl'}
                  >
                    <LuUserX className="w-5 h-5" />
                    <span className="ml-2">Eliminar Proveedor</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <span>¿Eliminar proveedor?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span>¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer y eliminará permanentemente todos los datos del proveedor.</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      disabled={isDeleting}
                    >
                      <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
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
                    <span className="ml-2">Activar Proveedor</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <span>¿Activar proveedor?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span>¿Estás seguro de que deseas activar este proveedor?</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={handleActivate}
                      disabled={isActivating}
                    >
                      <span>{isActivating ? 'Activando...' : 'Activar'}</span>
                    </AlertDialogAction>
                    <AlertDialogCancel>
                      <span>Cancelar</span>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Edit Proveedor Modal */}
        <EditProveedorModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          proveedor={proveedor}
        />
      </div>
    </div>
  );
};

export default ProveedorDetailModal;
