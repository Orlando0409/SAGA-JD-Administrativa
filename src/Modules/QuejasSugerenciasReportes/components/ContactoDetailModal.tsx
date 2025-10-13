// src/Modules/QuejasSugerenciasReportes/components/ContactoDetailModal.tsx
import { useState } from 'react';
import { 
  LuX, 
  LuFileText, 
  LuTriangle, 
  LuLightbulb, 
  LuCalendar, 
  LuUser, 
  LuMapPin, 
  LuMessageSquare,
  LuTrash2,
} from 'react-icons/lu';
import { FaUserEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
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
import type { ContactoItem } from './ContactoTable';
import { useDeleteQueja, useDeleteSugerencia, useDeleteReporte } from '../hook/HookContacto';

interface ContactoDetailModalProps {
  item: ContactoItem;
  isOpen: boolean;
  onClose: () => void;
}

const ContactoDetailModal = ({ item, isOpen, onClose }: ContactoDetailModalProps) => {
  const [openSections, setOpenSections] = useState<number[]>([1, 2, 3]);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteQuejaMutation = useDeleteQueja();
  const deleteSugerenciaMutation = useDeleteSugerencia();
  const deleteReporteMutation = useDeleteReporte();


  if (!isOpen) return null;

  const handleAccordion = (id: number) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(sectionId => sectionId !== id)
        : [...prev, id]
    );
  };

  const getTipoConfig = (tipo: string) => {
    const configs = {
      'Queja': { icon: LuTriangle, color: 'text-red-600 bg-red-50 border-red-200', title: 'Detalle de Queja' },
      'Sugerencia': { icon: LuLightbulb, color: 'text-yellow-600 bg-yellow-50 border-yellow-200', title: 'Detalle de Sugerencia' },
      'Reporte': { icon: LuFileText, color: 'text-blue-600 bg-blue-50 border-blue-200', title: 'Detalle de Reporte' }
    };
    return configs[tipo as keyof typeof configs];
  };

  const handleDelete = async () => {
    try {
      switch (item.tipo) {
        case 'Queja':
          await deleteQuejaMutation.mutateAsync(item.id);
          break;
        case 'Sugerencia':
          await deleteSugerenciaMutation.mutateAsync(item.id);
          break;
        case 'Reporte':
          await deleteReporteMutation.mutateAsync(item.id);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };


  const config = getTipoConfig(item.tipo);
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className="w-6 h-6" />
              <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header Card */}
          <div className={`${config.color} p-6 rounded-lg mb-6 border`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {item.nombre ? `${item.nombre} ${item.primerApellido || ''}` : 'Usuario Anónimo'}
                </h2>
                <p className="opacity-80">
                  {item.tipo} - {item.fechaCreacion ? format(new Date(item.fechaCreacion), 'dd/MM/yyyy', { locale: es }) : 'Fecha no disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {/* Información Personal */}
            {(item.nombre || item.primerApellido) && (
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
                      <span className="text-gray-900">Información Personal</span>
                    </div>
                    <span className="text-gray-500">
                      {openSections.includes(1) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                    </span>
                  </div>
                </AccordionHeader>
                <AccordionBody className="px-6 pb-6" placeholder="">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {item.nombre && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Nombre</span>
                        <p className="text-gray-900 font-medium">{item.nombre}</p>
                      </div>
                    )}
                    {item.primerApellido && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Primer Apellido</span>
                        <p className="text-gray-900 font-medium">{item.primerApellido}</p>
                      </div>
                    )}
                    {item.segundoApellido && (
                      <div>
                        <span className="block text-sm font-medium text-gray-500 mb-1">Segundo Apellido</span>
                        <p className="text-gray-900 font-medium">{item.segundoApellido}</p>
                      </div>
                    )}
                  </div>
                </AccordionBody>
              </Accordion>
            )}

            {/* Contenido Principal */}
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
                    <LuMessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Contenido</span>
                  </div>
                  <span className="text-gray-500">
                    {openSections.includes(2) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody className="px-6 pb-6" placeholder="">
                <div className="space-y-4">
                  {/* Ubicación */}
                  {item.ubicacion && (
                    <div>
                      <span className="block text-sm font-medium text-gray-500 mb-2">Ubicación</span>
                      <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <LuMapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-800">{item.ubicacion}</p>
                      </div>
                    </div>
                  )}

                  {/* Mensaje */}
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-2">Mensaje</span>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.mensaje}</p>
                    </div>
                  </div>

                  {/* Adjunto */}
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-2">Archivo Adjunto</span>
                    {item.adjunto ? (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm flex items-center gap-2">
                          📎 <span>Archivo adjunto disponible</span>
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-500 text-sm">Sin adjuntos</p>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionBody>
            </Accordion>

            {/* Estado y Fecha */}
            <Accordion
              open={openSections.includes(3)}
              animate={CUSTOM_ANIMATION}
              className="border border-gray-200 rounded-lg shadow-sm bg-white"
              {...({} as any)}
            >
              <AccordionHeader
                onClick={() => handleAccordion(3)}
                className="text-base font-semibold px-6 py-4 border-b-0 hover:bg-gray-50"
                {...({} as any)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <LuCalendar className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900">Información Adicional</span>
                  </div>
                  <span className="text-gray-500">
                    {openSections.includes(3) ? <FiChevronDown size={20} /> : <FiChevronRight size={20} />}
                  </span>
                </div>
              </AccordionHeader>
              <AccordionBody className="px-6 pb-6" placeholder="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Fecha */}
                  <div>
                    <span className="block text-sm font-medium text-gray-500 mb-2">Fecha de Creación</span>
                    <p className="text-gray-800 flex items-center gap-2">
                      <LuCalendar className="w-4 h-4 text-gray-400" />
                      {item.fechaCreacion ? 
                        format(new Date(item.fechaCreacion), 'dd/MM/yyyy HH:mm', { locale: es }) : 
                        'No disponible'
                      }
                    </p>
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
              Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  size={'xl'}
                >
                  <LuTrash2 className="w-5 h-5" />
                  <span className="ml-2">Eliminar</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <span>¿Eliminar {item.tipo.toLowerCase()}?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    <span>Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta {item.tipo.toLowerCase()}?</span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteQuejaMutation.isPending || deleteSugerenciaMutation.isPending || deleteReporteMutation.isPending}
                  >
                    <span>Eliminar</span>
                  </AlertDialogAction>
                  <AlertDialogCancel>
                    <span>Cancelar</span>
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Modal de edición (placeholder) */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Editar {item.tipo}</h3>
              <p className="mb-4">Modal de edición por implementar</p>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactoDetailModal;