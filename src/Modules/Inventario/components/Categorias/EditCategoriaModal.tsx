import React, { useState, useEffect } from 'react';
import { LuX } from 'react-icons/lu';
import { useUpdateCategoria } from '../../hooks/useCategorias';
import type { CategoriaMaterial } from '../../models/Inventario';
import { UpdateCategoriaMaterialSchema, type UpdateCategoriaMaterialSchemaData } from '../../schema/UpdateCategoriaMaterialSchema';
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

interface EditCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: CategoriaMaterial;
}

interface FormData extends UpdateCategoriaMaterialSchemaData {
  Descripcion_Categoria: string;
}

const EditCategoriaModal: React.FC<EditCategoriaModalProps> = ({ isOpen, onClose, categoria }) => {
  const updateCategoriaMutation = useUpdateCategoria();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [charCount, setCharCount] = useState({ name: 0, description: 0 });
  const MAX_NAME_LENGTH = 30;
  const MAX_DESC_LENGTH = 100;
  
  const [formData, setFormData] = useState<FormData>({
    Nombre_Categoria: '',
    Descripcion_Categoria: '',
  });

  // Cargar los datos de la categoría cuando cambie
  useEffect(() => {
    if (categoria) {
      setFormData({
        Nombre_Categoria: categoria.Nombre_Categoria,
        Descripcion_Categoria: categoria.Descripcion_Categoria || '',
      });
      setCharCount({
        name: categoria.Nombre_Categoria.length,
        description: (categoria.Descripcion_Categoria || '').length,
      });
    }
  }, [categoria]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const maxLength = name === 'Nombre_Categoria' ? MAX_NAME_LENGTH : MAX_DESC_LENGTH;
    
    if (value.length <= maxLength) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setCharCount(prev => ({
        ...prev,
        [name === 'Nombre_Categoria' ? 'name' : 'description']: value.length
      }));
      
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Preparar datos para validación (solo campos que pueden cambiar)
    const dataToValidate = {
      Nombre_Categoria: formData.Nombre_Categoria?.trim(),
      Descripcion_Categoria: formData.Descripcion_Categoria?.trim()
    };

    // Validación con Zod
    const validationResult = UpdateCategoriaMaterialSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as string] = error.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    // Verificar si hay cambios
    const hasChanges = 
      formData.Nombre_Categoria?.trim() !== categoria.Nombre_Categoria ||
      formData.Descripcion_Categoria?.trim() !== (categoria.Descripcion_Categoria || '');

    if (!hasChanges) {
      onClose();
      return;
    }

    try {
      await updateCategoriaMutation.mutateAsync({
        id: categoria.Id_Categoria,
        data: validationResult.data
      });
      onClose();
    } catch (error) {
      console.error('Error updating categoria:', error);
      setFormErrors({ Nombre_Categoria: 'Error al actualizar la categoría' });
    }
  };

  const renderCharCounter = (current: number, max: number, hasError: boolean) => {
    const remaining = max - current;
    const isNearLimit = remaining <= 5;
    
    return (
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {hasError ? 'Corrige los errores antes de continuar' : 'Modifica este campo'}
        </span>
        <span className={`text-xs font-medium ${
          isNearLimit ? 'text-orange-600' : 'text-gray-500'
        }`}>
          {current}/{max}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Categoría
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre-categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre-categoria"
                name="Nombre_Categoria"
                type="text"
                value={formData.Nombre_Categoria}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  formErrors.Nombre_Categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ej: Tuberías, Herramientas, Químicos"
                autoComplete="off"
              />
              {renderCharCounter(charCount.name, MAX_NAME_LENGTH, !!formErrors.Nombre_Categoria)}
              {formErrors.Nombre_Categoria && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Nombre_Categoria}</p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion-categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de la Categoría
              </label>
              <textarea
                id="descripcion-categoria"
                name="Descripcion_Categoria"
                value={formData.Descripcion_Categoria}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  formErrors.Descripcion_Categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Describe el tipo de materiales que incluye esta categoría"
              />
              {renderCharCounter(charCount.description, MAX_DESC_LENGTH, !!formErrors.Descripcion_Categoria)}
              {formErrors.Descripcion_Categoria && (
                <p className="text-red-500 text-sm mt-1">{formErrors.Descripcion_Categoria}</p>
              )}
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={updateCategoriaMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updateCategoriaMutation.isPending ? 'Actualizando...' : 'Actualizar'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmar actualización?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que deseas actualizar esta categoría? Esta acción modificará la información de la categoría en el sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={(e) => handleSubmit(e as any)}
                      disabled={updateCategoriaMutation.isPending}
                    >
                      {updateCategoriaMutation.isPending ? 'Actualizando...' : 'Confirmar'}
                    </AlertDialogAction>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
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

export default EditCategoriaModal;