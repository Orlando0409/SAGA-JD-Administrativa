import React, { useState } from 'react';
import { LuX, LuPlus } from 'react-icons/lu';
import { useCreateMaterial, useCategories } from '../hooks/InventarioHook';
import { CreateMaterialSchema, type CreateMaterialSchemaData } from '../schema/CreateMaterialSchema';
import type { CreateMaterialModalProps } from '../types/MaterialTypes';
import type { CreateMaterialData, CategoriaMaterial } from '../models/Inventario';
import CreateCategoriaModal from './CreateCategoriaModal';
import { 
  NOMBRE_MATERIAL_MAX_LENGTH, 
  DESCRIPCION_MAX_LENGTH, 
  PRECIO_MIN 
} from '../types/MaterialTypes';

const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({ isOpen, onClose }) => {
  const createMaterialMutation = useCreateMaterial();
  const { data: categories = [] } = useCategories();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    nombreMaterial: 0,
    descripcion: 0
  });
  const [isCreateCategoriaModalOpen, setIsCreateCategoriaModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<CreateMaterialSchemaData>({
    Nombre_Material: '',
    Descripcion: '',
    Cantidad: 1,
    Precio_Unitario: 0.10,
    IDS_Categorias: [],
  });

  const createInputHandler = (fieldName: keyof CreateMaterialSchemaData, maxLength: number) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      if (value.length <= maxLength) {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        
        if (fieldName === 'Nombre_Material') {
          setFieldCharCounts(prev => ({ ...prev, nombreMaterial: value.length }));
        } else if (fieldName === 'Descripcion') {
          setFieldCharCounts(prev => ({ ...prev, descripcion: value.length }));
        }
        
        if (formErrors[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const validation = CreateMaterialSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      const payload: CreateMaterialData = {
        Nombre_Material: formData.Nombre_Material,
        Descripcion: formData.Descripcion,
        Cantidad: formData.Cantidad,
        Precio_Unitario: formData.Precio_Unitario,
        IDS_Categorias: formData.IDS_Categorias ?? []
      };

      await createMaterialMutation.mutateAsync(payload);
      onClose();
      setFormData({
        Nombre_Material: '',
        Descripcion: '',
        Cantidad: 1,
        Precio_Unitario: 0.10,
        IDS_Categorias: [],
      });
      setFieldCharCounts({ nombreMaterial: 0, descripcion: 0 });
    } catch (error) {
      console.log('Error creating material:', error);
    }
  };

  const renderCharCounter = (current: number, max: number, hasError: boolean) => {
    const remaining = max - current;
    const isNearLimit = remaining <= 5;
    
    return (
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {hasError ? 'Corrige los errores antes de continuar' : 'Completa este campo'}
        </span>
        <span className={`text-xs font-medium ${
          isNearLimit ? 'text-orange-600' : 'text-gray-500'
        }`}>
          {current}/{max}
        </span>
      </div>
    );
  };

  const handleCategoryChange = (categoriaId: number, checked: boolean) => {
    const currentValues = formData.IDS_Categorias ?? [];
    if (checked) {
      setFormData(prev => ({ 
        ...prev, 
        IDS_Categorias: [...currentValues, categoriaId] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        IDS_Categorias: currentValues.filter((id: number) => id !== categoriaId) 
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Material</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre-material" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Material <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre-material"
                type="text"
                value={formData.Nombre_Material}
                onChange={createInputHandler('Nombre_Material', NOMBRE_MATERIAL_MAX_LENGTH)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Nombre_Material ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Cemento Portland"
              />
              {renderCharCounter(fieldCharCounts.nombreMaterial, NOMBRE_MATERIAL_MAX_LENGTH, !!formErrors.Nombre_Material)}
              {formErrors.Nombre_Material && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Material}</p>
              )}
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                value={formData.Descripcion}
                onChange={createInputHandler('Descripcion', DESCRIPCION_MAX_LENGTH)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 scrollbar-thin focus:border-transparent resize-none ${
                  formErrors.Descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción del materiaL"
              />
              {renderCharCounter(fieldCharCounts.descripcion, DESCRIPCION_MAX_LENGTH, !!formErrors.Descripcion)}
              {formErrors.Descripcion && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Descripcion}</p>
              )}
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad <span className="text-red-500">*</span>
              </label>
              <input
                id="cantidad"
                type="number"
                min="1"
                value={formData.Cantidad}
                onChange={(e) => setFormData(prev => ({ ...prev, Cantidad: parseInt(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Cantidad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.Cantidad && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Cantidad}</p>
              )}
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario (₡) <span className="text-red-500">*</span>
              </label>
              <input
                id="precio"
                type="number"
                min={PRECIO_MIN}
                step="0.01"
                value={formData.Precio_Unitario}
                onChange={(e) => setFormData(prev => ({ ...prev, Precio_Unitario: parseFloat(e.target.value) || PRECIO_MIN }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.Precio_Unitario ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.Precio_Unitario && (
                <p className="text-red-500 text-xs mt-1">{formErrors.Precio_Unitario}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="block text-sm font-medium text-gray-700">
                  Categorías (Opcional)
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreateCategoriaModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <LuPlus className="w-3 h-3" />
                  Nueva
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                {categories.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No hay categorías disponibles. Crea una nueva categoría.
                  </div>
                ) : (
                  categories.map((categoria: CategoriaMaterial) => (
                    <label key={categoria.Id_Categoria} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={(formData.IDS_Categorias ?? []).includes(categoria.Id_Categoria)}
                        onChange={(e) => handleCategoryChange(categoria.Id_Categoria, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{categoria.Nombre_Categoria}</span>
                    </label>
                  ))
                )}
              </div>
              {formErrors.IDS_Categorias && (
                <p className="text-red-500 text-xs mt-1">{formErrors.IDS_Categorias}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createMaterialMutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMaterialMutation.isPending ? 'Creando...' : 'Crear Material'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CreateCategoriaModal
        isOpen={isCreateCategoriaModalOpen}
        onClose={() => setIsCreateCategoriaModalOpen(false)}
      />
    </div>
  )
}

export default CreateMaterialModal