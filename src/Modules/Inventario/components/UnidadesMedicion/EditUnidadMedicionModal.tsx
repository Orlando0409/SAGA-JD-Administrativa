import React, { useState, useEffect } from 'react';
import { useUpdateUnidadMedicion } from '../../hooks/HookUnidadMedicion';
import type { UnidadMedicion } from '../../models/Inventario';
import { UpdateUnidadMedicionSchema, type UpdateUnidadMedicionSchemaData } from '../../schema/UpdateUnidadMedicionSchema';
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

interface EditUnidadMedicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidad: UnidadMedicion;
}


const EditUnidadMedicionModal: React.FC<EditUnidadMedicionModalProps> = ({ isOpen, onClose, unidad }) => {
  const updateUnidadMutation = useUpdateUnidadMedicion();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<UpdateUnidadMedicionSchemaData>({
    Nombre_Unidad_Medicion: '',
    Abreviatura: '',
    Descripcion: '',
  });

  useEffect(() => {
    if (unidad) {
      setFormData({
        Nombre_Unidad_Medicion: unidad.Nombre_Unidad_Medicion || unidad.Nombre_Unidad || '',
        Abreviatura: unidad.Abreviatura,
        Descripcion: unidad.Descripcion || '',
      });
    }
  }, [unidad]);

  const handleInputChange = (field: keyof UpdateUnidadMedicionSchemaData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

  
    const validation = UpdateUnidadMedicionSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    const hasChanges = 
      formData.Nombre_Unidad_Medicion?.trim() !== (unidad.Nombre_Unidad_Medicion || unidad.Nombre_Unidad) ||
      formData.Abreviatura?.trim() !== unidad.Abreviatura ||
      (formData.Descripcion?.trim() || '') !== (unidad.Descripcion || '');

    if (!hasChanges) {
      onClose();
      return;
    }

    try {
      await updateUnidadMutation.mutateAsync({
        id: unidad.Id_Unidad_Medicion,
        data: {
          Nombre_Unidad_Medicion: formData.Nombre_Unidad_Medicion?.trim(),
          Abreviatura: formData.Abreviatura?.trim(),
          Descripcion: formData.Descripcion?.trim() || undefined,
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating unidad medicion:', error);
      setFormErrors({ Nombre_Unidad_Medicion: 'Error al actualizar la unidad de medición' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4 flex flex-col overflow-hidden max-h-[90vh]">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <h2 className="text-xl font-bold text-gray-900">
            Editar Unidad de Medición
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-6">
            <form id="edit-unidad-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre-unidad" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Unidad <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre-unidad"
                type="text"
                value={formData.Nombre_Unidad_Medicion}
                onChange={handleInputChange('Nombre_Unidad_Medicion')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  formErrors.Nombre_Unidad_Medicion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: Kilogramo, Litro, Metro"
                autoComplete="off"
              />
              {formErrors.Nombre_Unidad_Medicion && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Nombre_Unidad_Medicion}</p>
              )}
            </div>

            <div>
              <label htmlFor="abreviatura" className="block text-sm font-medium text-gray-700 mb-1">
                Abreviatura <span className="text-red-500">*</span>
              </label>
              <input
                id="abreviatura"
                type="text"
                value={formData.Abreviatura}
                onChange={handleInputChange('Abreviatura')}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono ${
                  formErrors.Abreviatura ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: kg, L, m"
                autoComplete="off"
              />
              {formErrors.Abreviatura && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Abreviatura}</p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-gray-500">(opcional)</span>
              </label>
              <textarea
                id="descripcion"
                value={formData.Descripcion}
                onChange={handleInputChange('Descripcion')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  formErrors.Descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Descripción adicional de la unidad de medición"
              />
              {formErrors.Descripcion && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Descripcion}</p>
              )}
            </div>
            </form>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={updateUnidadMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {updateUnidadMutation.isPending ? 'Actualizando...' : 'Actualizar Unidad'}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar actualización?</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que deseas actualizar esta unidad de medición? Esta acción modificará la información de la unidad en el sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={(e) => handleSubmit(e as any)}
                  disabled={updateUnidadMutation.isPending}
                >
                  {updateUnidadMutation.isPending ? 'Actualizando...' : 'Confirmar'}
                </AlertDialogAction>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUnidadMedicionModal;
