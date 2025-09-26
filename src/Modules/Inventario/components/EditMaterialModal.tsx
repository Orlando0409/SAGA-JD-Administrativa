import React, { useState, useEffect } from 'react';
import { useCategories, useUpdateMaterial } from '../hooks/InventarioHook';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { CreateMaterialSchema } from '../schema/CreateMaterialSchema';
import { 
  NOMBRE_MATERIAL_MAX_LENGTH, 
  DESCRIPCION_MAX_LENGTH, 
  PRECIO_MIN, 
  type EditMaterialModalProps
} from '../types/MaterialTypes';
import type { UpdateMaterialData } from '../models/Material';


const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  const { showError } = useAlerts();
  const updateMaterialMutation = useUpdateMaterial();
  const { data: categorias = [] } = useCategories();
  
  const [formData, setFormData] = useState<UpdateMaterialData>({
    Nombre_Material: '',
    Descripcion: '',
    Cantidad: 0,
    Precio_Unitario: 0,
    IDS_Categorias: [],
  });

  const [selectedCategorias, setSelectedCategorias] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    nombreMaterial: 0,
    descripcion: 0
  });

  useEffect(() => {
    if (isOpen && material) {
      setFormData({
        Nombre_Material: material.Nombre_Material,
        Descripcion: material.Descripcion || '',
        Cantidad: material.Cantidad,
        Precio_Unitario: material.Precio_Unitario,
        IDS_Categorias: material.Categorias?.map(cat => cat.Id_Categoria) || [],
      });
      setSelectedCategorias(material.Categorias?.map(cat => cat.Id_Categoria) || []);
      setFieldCharCounts({
        nombreMaterial: material.Nombre_Material.length,
        descripcion: (material.Descripcion || '').length
      });
      setFormErrors({});
    }
  }, [isOpen, material]);

  if (!isOpen) return null;

  const createInputHandler = (fieldName: string, maxLength?: number) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      if (maxLength && value.length > maxLength) {
        return;
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: value }));
      
      if (fieldName === 'Nombre_Material') {
        setFieldCharCounts(prev => ({ ...prev, nombreMaterial: value.length }));
      } else if (fieldName === 'Descripcion') {
        setFieldCharCounts(prev => ({ ...prev, descripcion: value.length }));
      }
      
      if (formErrors[fieldName]) {
        setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    };
  };

  const renderCharCounter = (current: number, max: number) => (
    <span className={`text-xs ${current > max * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
      {current}/{max}
    </span>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = CreateMaterialSchema.safeParse({
      ...formData,
      IDS_Categorias: selectedCategorias,
    });
    
    if (!validationResult.success) {
      const errors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as string] = error.message;
        }
      });
      setFormErrors(errors);
      
      showError('Por favor, corrige los errores en el formulario');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const updateData: UpdateMaterialData = {
        ...formData,
        IDS_Categorias: selectedCategorias,
      };

      await updateMaterialMutation.mutateAsync({
        Id_Material: material.Id_Material,
        materialData: updateData,
      });

      onClose();
      window.dispatchEvent(new Event('refreshInventario'));
    } catch (error: any) {
      console.log('Error al actualizar material:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoriaChange = (categoriaId: number, checked: boolean) => {
    setSelectedCategorias(prev => 
      checked 
        ? [...prev, categoriaId]
        : prev.filter(id => id !== categoriaId)
    );
  };

  return (
    <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar Material
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="nombre" className="block text-sm flex gap-2 font-medium text-gray-700">
                  Nombre del Material
                  <p className="text-red-500">*</p>
                </label>
                {renderCharCounter(fieldCharCounts.nombreMaterial, NOMBRE_MATERIAL_MAX_LENGTH)}
              </div>
              <input
                type="text"
                id="nombre"
                value={formData.Nombre_Material}
                onChange={createInputHandler('Nombre_Material', NOMBRE_MATERIAL_MAX_LENGTH)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.Nombre_Material 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
                required
              />
              {formErrors.Nombre_Material && (
                <p className="mt-1 text-sm text-red-600">{formErrors.Nombre_Material}</p>
              )}
            </div>

            <div>
              <label htmlFor="cantidad" className="block text-sm flex gap-2 font-medium text-gray-700 mb-1">
                Cantidad 
                <p className="text-red-500">*</p>
              </label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={formData.Cantidad}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, Cantidad: value });
                  if (formErrors.Cantidad) {
                    setFormErrors(prev => ({ ...prev, Cantidad: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.Cantidad 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
                required
              />
              {formErrors.Cantidad && (
                <p className="mt-1 text-sm text-red-600">{formErrors.Cantidad}</p>
              )}
            </div>

            <div>
              <label htmlFor="precio" className="block text-sm flex gap-2 font-medium text-gray-700 mb-1">
                Precio Unitario (₡) 
                <p className="text-red-500">*</p>
              </label>
              <input
                type="number"
                id="precio"
                min={PRECIO_MIN}
                step="0.01"
                value={formData.Precio_Unitario}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData({ ...formData, Precio_Unitario: value });
                  if (formErrors.Precio_Unitario) {
                    setFormErrors(prev => ({ ...prev, Precio_Unitario: '' }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.Precio_Unitario 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
                required
              />
              {formErrors.Precio_Unitario && (
                <p className="mt-1 text-sm text-red-600">{formErrors.Precio_Unitario}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="descripcion" className="block text-sm flex gap-2font-medium text-gray-700">
                Descripción
                <p className='text-red-500'>*</p>
              </label>
              {renderCharCounter(fieldCharCounts.descripcion, DESCRIPCION_MAX_LENGTH)}
            </div>
            <textarea
              id="descripcion"
              rows={3}
              value={formData.Descripcion}
              onChange={createInputHandler('Descripcion', DESCRIPCION_MAX_LENGTH)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.Descripcion 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300'
              }`}
              placeholder="Descripción del material..."
              required
            />
            {formErrors.Descripcion && (
              <p className="mt-1 text-sm text-red-600">{formErrors.Descripcion}</p>
            )}
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Categorías (Opcional)
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-md p-3 ${
              formErrors.IDS_Categorias 
                ? 'border-red-500' 
                : 'border-gray-300'
            }`}>
              {categorias.map((categoria) => (
                <label key={categoria.Id_Categoria} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategorias.includes(categoria.Id_Categoria)}
                    onChange={(e) => {
                      handleCategoriaChange(categoria.Id_Categoria, e.target.checked);
                      if (formErrors.IDS_Categorias) {
                        setFormErrors(prev => ({ ...prev, IDS_Categorias: '' }));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{categoria.Nombre_Categoria}</span>
                </label>
              ))}
            </div>
            {formErrors.IDS_Categorias && (
              <p className="mt-1 text-sm text-red-600">{formErrors.IDS_Categorias}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMaterialModal