import React, { useState } from 'react';
import { LuX, LuPlus } from 'react-icons/lu';
import { useCreateCategoria } from '../hooks/InventarioHook';
import { CreateCategoriaMaterialSchema, type CreateCategoriaMaterialSchemaData } from '../schema/CreateCategoriaMaterialSchema';
import { NOMBRE_CATEGORIA_MAX_LENGTH } from '../types/MaterialTypes';

interface CreateCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCategoriaModal: React.FC<CreateCategoriaModalProps> = ({ isOpen, onClose }) => {
  const createCategoriaMutation = useCreateCategoria();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCount, setFieldCharCount] = useState(0);
  
  const [formData, setFormData] = useState<CreateCategoriaMaterialSchemaData>({
    Nombre_Categoria: '',
  });

  const createInputHandler = (fieldName: keyof CreateCategoriaMaterialSchemaData, maxLength: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (value.length <= maxLength) {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        setFieldCharCount(value.length);
        
        if (formErrors[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = CreateCategoriaMaterialSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      await createCategoriaMutation.mutateAsync(formData);
      onClose();
      // Reset form
      setFormData({ Nombre_Categoria: '' });
      setFieldCharCount(0);
    } catch (error) {
      console.error('Error creating categoria:', error);
    }
  };

  const renderCharCounter = (current: number, max: number, hasError: boolean) => {
    const remaining = max - current;
    const isNearLimit = remaining <= 5;
    
    const getTextColor = (hasError: boolean, isNearLimit: boolean) => {
      if (hasError) return 'text-red-500';
      if (isNearLimit) return 'text-orange-500';
      return 'text-gray-500';
    };
    
    return (
      <div className="flex justify-between items-center mt-1">
        <span className={`text-xs ${getTextColor(hasError, isNearLimit)}`}>
          {remaining} caracteres restantes
        </span>
        <span className={`text-xs ${getTextColor(hasError, isNearLimit)}`}>
          {current}/{max}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <LuPlus className="w-5 h-5" />
            Nueva Categoría
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="nombre-categoria" className="block text-sm font-medium text-gray-700">
                  Nombre de la Categoría *
                </label>
              </div>
              <input
                type="text"
                id="nombre-categoria"
                value={formData.Nombre_Categoria}
                onChange={createInputHandler('Nombre_Categoria', NOMBRE_CATEGORIA_MAX_LENGTH)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.Nombre_Categoria 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Ej: Plomería, Herramientas, etc."
                required
              />
              {renderCharCounter(fieldCharCount, NOMBRE_CATEGORIA_MAX_LENGTH, !!formErrors.Nombre_Categoria)}
              {formErrors.Nombre_Categoria && (
                <p className="mt-1 text-sm text-red-600">{formErrors.Nombre_Categoria}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createCategoriaMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createCategoriaMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <LuPlus className="w-4 h-4" />
                  Crear Categoría
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoriaModal;