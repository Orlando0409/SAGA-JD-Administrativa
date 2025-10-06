import React, { useState } from 'react';
import { useCreateUnidadMedicion } from '../../hooks/HookUnidadMedicion';
import { CreateUnidadMedicionSchema, type CreateUnidadMedicionSchemaData } from '../../schema/CreateUnidadMedicionSchema';
import { useAuth } from '@/Modules/Auth/Context/AuthContext';

interface CreateUnidadMedicionModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const CreateUnidadMedicionModal: React.FC<CreateUnidadMedicionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const createUnidadMedicionMutation = useCreateUnidadMedicion();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateUnidadMedicionSchemaData>({
    Nombre_Unidad_Medicion: '',
    Abreviatura: '',
    Descripcion: '',
  });

  const handleInputChange = (field: keyof CreateUnidadMedicionSchemaData) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Use Zod schema validation
    const validation = CreateUnidadMedicionSchema.safeParse(formData);

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
      if (!user?.Id_Usuario) {
        console.error('Usuario no autenticado');
        return;
      }

      await createUnidadMedicionMutation.mutateAsync({
        data: {
          Nombre_Unidad_Medicion: formData.Nombre_Unidad_Medicion.trim(),
          Abreviatura: formData.Abreviatura.trim(),
          Descripcion: formData.Descripcion?.trim() || undefined,
        },
        idUsuarioCreador: user.Id_Usuario
      });
      
      onClose();
      setFormData({
        Nombre_Unidad_Medicion: '',
        Abreviatura: '',
        Descripcion: '',
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error al crear unidad de medición:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Unidad de Medición</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="nombre-unidad" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Unidad <span className="text-red-500">*</span>
            </label>
            <input
              id="nombre-unidad"
              type="text"
              value={formData.Nombre_Unidad_Medicion}
              onChange={handleInputChange('Nombre_Unidad_Medicion')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.Nombre_Unidad_Medicion ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: Kilogramo, Metro, Litro"
            />
            {formErrors.Nombre_Unidad_Medicion && (
              <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Unidad_Medicion}</p>
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono ${
                formErrors.Abreviatura ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ej: kg, m, L"
            />
            {formErrors.Abreviatura && (
              <p className="text-red-500 text-xs mt-1">{formErrors.Abreviatura}</p>
            )}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={formData.Descripcion}
              onChange={handleInputChange('Descripcion')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                formErrors.Descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Descripción de la unidad de medición (opcional)"
            />
            {formErrors.Descripcion && (
              <p className="text-red-500 text-xs mt-1">{formErrors.Descripcion}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={createUnidadMedicionMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createUnidadMedicionMutation.isPending ? 'Creando...' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUnidadMedicionModal;