import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { 
  CreateProveedorSchemaWithIdentificacionValidation, 
  type CreateProveedorSchemaData,
  VALIDATION_LIMITS
} from '../Schema/Proveedores';
import type { ProveedorFisico } from '../Models/TablaProveedo/proveedorFisico';

interface EditProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedor: ProveedorFisico;
}

const EditProveedorModal: React.FC<EditProveedorModalProps> = ({ isOpen, onClose, proveedor }) => {
  // const updateProveedorMutation = useUpdateProveedorFisico(); // Temporalmente comentado
  // Mock temporal para evitar errores
  const updateProveedorMutation = {
    mutateAsync: async (data: any) => {
      console.log('Función de actualización temporalmente deshabilitada:', data);
      return Promise.resolve();
    },
    isPending: false
  };
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    Nombre_Proveedor: proveedor.Nombre_Proveedor.length,
    Telefono_Proveedor: proveedor.Telefono_Proveedor.length
  });

  // Función para validar en tiempo real
  const validateFieldRealTime = (fieldName: string, value: string, tipoIdentificacion?: string) => {
    let error = '';

    switch (fieldName) {
      case 'Nombre_Proveedor':
        const nombre = value.trim();
        if (nombre && nombre.length >= 2) {
          const NOMBRE_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
          if (!NOMBRE_REGEX.test(nombre)) {
            error = 'El nombre solo puede contener letras y espacios';
          }
        }
        break;

      case 'Identificacion':
        if (value && tipoIdentificacion) {
          const cleanValue = value.replace(/[\s\-]/g, '').toUpperCase();
          
          switch (tipoIdentificacion) {
            case 'Cedula':
              if (!/^\d*$/.test(cleanValue)) {
                error = 'La cédula solo puede contener números';
              } else if (cleanValue.length > 0 && cleanValue[0] === '0') {
                error = 'La cédula no puede empezar con 0';
              } else if (cleanValue.length > 0 && cleanValue.length !== 9 && cleanValue.length === value.length) {
                error = 'La cédula debe tener exactamente 9 dígitos';
              }
              break;

            case 'Dimex':
              if (!/^\d*$/.test(cleanValue)) {
                error = 'El DIMEX solo puede contener números';
              } else if (cleanValue.length > 0 && cleanValue[0] === '0') {
                error = 'El DIMEX no puede empezar con 0';
              } else if (cleanValue.length > 0 && cleanValue.length !== 12 && cleanValue.length === value.length) {
                error = 'El DIMEX debe tener exactamente 12 dígitos';
              }
              break;

            case 'Pasaporte':
              if (!/^[A-Z0-9]*$/.test(cleanValue)) {
                error = 'El pasaporte solo puede contener letras y números';
              } else if (cleanValue.length > 0 && cleanValue.length < 6) {
                error = 'El pasaporte debe tener al menos 6 caracteres';
              } else if (cleanValue.length >= 6) {
                const letters = cleanValue.match(/[A-Z]/g);
                if (!letters || letters.length === 0) {
                  error = 'El pasaporte debe tener al menos 1 letra';
                } else if (letters.length > 3) {
                  error = 'El pasaporte puede tener máximo 3 letras';
                }
              }
              break;
          }
        }
        break;

      case 'Telefono_Proveedor':
        if (value) {
          const TELEFONO_REGEX = /^(\+?\d{1,3}[\s\-]?)?\d{4}[\s\-]?\d{4}$/;
          if (!TELEFONO_REGEX.test(value)) {
            error = 'Formato de teléfono inválido. Ej: 8888-7777 o +506-8888-7777';
          }
        }
        break;
    }

    // Actualizar errores en tiempo real
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));

    return error === '';
  };

  // Función para crear el handler de input con validación en tiempo real
  const createInputHandler = (fieldName: string, handleChange: (value: string) => void, maxLength: number, tipoIdentificacion?: string) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Limitar caracteres al máximo permitido
      if (value.length <= maxLength) {
        handleChange(value);
        setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));
        
        // Validar en tiempo real
        validateFieldRealTime(fieldName, value, tipoIdentificacion);
      }
    };
  };

  const form = useForm({
    defaultValues: {
      Nombre_Proveedor: proveedor.Nombre_Proveedor,
      Telefono_Proveedor: proveedor.Telefono_Proveedor,
      Tipo_Identificacion: proveedor.Tipo_Identificacion as any,
      Identificacion: proveedor.Identificacion,
      Id_Estado_Proveedor: proveedor.Estado_Proveedor?.Id_Estado_Proveedor || 0,
    },
    onSubmit: async ({ value }: { value: CreateProveedorSchemaData }) => {
      setFormErrors({});

      // Validar usando el schema de Zod
      const validation = CreateProveedorSchemaWithIdentificacionValidation.safeParse(value);

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
        // Los datos del formulario ya coinciden con la estructura esperada
        const payload = validation.data;
        console.log('🔍 Datos del formulario validados para actualización:', JSON.stringify(payload, null, 2));

        // Llamada real al servicio de actualización usando el hook
        await updateProveedorMutation.mutateAsync({ 
          id: proveedor.Id_Proveedor, 
          proveedor: payload 
        });
        
        // Cerrar modal después de actualización exitosa
        onClose();
      } catch (error) {
        console.error('❌ Error updating proveedor:', error);
        // El hook ya maneja mostrar el error
      }
    },
  });

  // Función para renderizar contador de caracteres
  const renderCharCounter = (current: number, max: number, hasError: boolean) => {
    const remaining = max - current;
    const isNearLimit = remaining <= 5;
    
    return (
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">
          {hasError ? '' : `Máximo ${max} caracteres`}
        </span>
        <span className={`text-xs font-medium ${
          isNearLimit ? 'text-orange-600' : 'text-gray-500'
        }`}>
          {current}/{max}
          {isNearLimit && current < max && (
            <span className="ml-1 text-orange-600">
              ({remaining} restantes)
            </span>
          )}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Proveedor</h2>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-140px)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Nombre del Proveedor */}
            <form.Field name="Nombre_Proveedor">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Proveedor *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={createInputHandler('Nombre_Proveedor', field.handleChange, VALIDATION_LIMITS.NOMBRE_MAX_LENGTH)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Nombre_Proveedor || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ingrese el nombre del proveedor (mín. 2 caracteres)"
                    maxLength={VALIDATION_LIMITS.NOMBRE_MAX_LENGTH}
                  />
                  
                  {renderCharCounter(
                    fieldCharCounts.Nombre_Proveedor, 
                    VALIDATION_LIMITS.NOMBRE_MAX_LENGTH, 
                    !!(formErrors.Nombre_Proveedor || field.state.meta.errors?.length)
                  )}

                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Nombre_Proveedor && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Proveedor}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Teléfono */}
            <form.Field name="Telefono_Proveedor">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={field.state.value}
                    onChange={createInputHandler('Telefono_Proveedor', field.handleChange, VALIDATION_LIMITS.TELEFONO_MAX_LENGTH)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: 8888-7777 o +506-8888-7777"
                    maxLength={VALIDATION_LIMITS.TELEFONO_MAX_LENGTH}
                  />
                  
                  {renderCharCounter(
                    fieldCharCounts.Telefono_Proveedor, 
                    VALIDATION_LIMITS.TELEFONO_MAX_LENGTH, 
                    !!(formErrors.Telefono_Proveedor || field.state.meta.errors?.length)
                  )}
                  
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Telefono_Proveedor && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Telefono_Proveedor}</p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={updateProveedorMutation.isPending}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateProveedorMutation.isPending}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  updateProveedorMutation.isPending 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700' 
                }`}
              >
                {updateProveedorMutation.isPending ? 'Actualizando...' : 'Actualizar Proveedor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProveedorModal;
