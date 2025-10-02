import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { LuX, LuUserPlus } from 'react-icons/lu';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { 
  CreateProveedorSchemaWithIdentificacionValidation, 
  type CreateProveedorSchemaData,
  VALIDATION_LIMITS,
  TIPOS_IDENTIFICACION_OPTIONS,
  IDENTIFICACION_PLACEHOLDERS,
  IDENTIFICACION_LIMITS_BY_TYPE
} from '../Schema/Proveedores';
import { useCreateProveedorFisico } from '../Hook/proveedoresFisicos';
import type { CreateProveedorData } from '../Models/TablaProveedo/proveedorFisico';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

interface CreateModalProveedorProps {
  onClose: () => void;
  setShowCreateModal?: (show: boolean) => void;
}

const CreateModalProveedor = ({ onClose, setShowCreateModal }: CreateModalProveedorProps) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    Nombre_Proveedor: 0,
    Telefono_Proveedor: 0,
    Identificacion: 0
  });

  // Hook de alertas
  const { showSuccess, showError, showWarning } = useAlerts();

  // Hook para crear proveedor físico
  const { 
    createProveedorFisico, 
    isCreating
  } = useCreateProveedorFisico();

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (onClose) onClose();
    if (setShowCreateModal) setShowCreateModal(false);
  };

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
            case 'Cedula Nacional':
              if (!/^\d*$/.test(cleanValue)) {
                error = 'La cédula solo puede contener números';
              } else if (cleanValue.length > 0 && cleanValue[0] === '0') {
                error = 'La cédula no puede empezar con 0';
              } else if (cleanValue.length > 0 && cleanValue.length !== 9 && cleanValue.length === value.length) {
                error = 'La cédula debe tener exactamente 9 dígitos';
              }
              break;

            case 'DIMEX':
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
          // Validar usando libphonenumber-js para mayor precisión
          if (!isValidPhoneNumber(value)) {
            error = 'Número de teléfono inválido para el país seleccionado';
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

  // Función para manejar errores de API específicos
  const handleApiError = (error: any) => {
    console.error('Error creating proveedor:', error);
    
    // Manejar errores HTTP 409 (conflictos de duplicación) - ALERTAS AMARILLAS
    if (error?.response?.status === 409) {
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.toLowerCase().includes('nombre') || errorMessage.toLowerCase().includes('name')) {
        showWarning('⚠️ Ya existe un proveedor con este nombre. Por favor, utiliza un nombre diferente.');
        return;
      }
      
      if (errorMessage.toLowerCase().includes('identificacion') || errorMessage.toLowerCase().includes('identification')) {
        showWarning('⚠️ Ya existe un proveedor con esta identificación. Por favor, verifica el número de identificación.');
        return;
      }
      
      // Error 409 genérico - también amarillo
      showWarning('⚠️ Ya existe un proveedor con esa identificación. Por favor, verifica la información ingresada.');
      return;
    }
    
    // Otros errores de validación del servidor
    if (error?.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Datos inválidos';
      showError(`Error de validación: ${errorMessage}`);
      return;
    }
    
    // Errores de red o servidor
    if (error?.response?.status >= 500) {
      showError('Error del servidor. Por favor, intenta nuevamente más tarde.');
      return;
    }
    
    // Error genérico
    const errorMessage = error?.message || 'Error desconocido al crear el proveedor';
    showError(`Error al crear el proveedor: ${errorMessage}`);
  };

  const form = useForm({
    defaultValues: {
      Nombre_Proveedor: '',
      Telefono_Proveedor: '',
      Tipo_Identificacion: '' as any,
      Identificacion: '',
      Id_Estado_Proveedor: 1, // Siempre activo por defecto
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
        // Preparar los datos según el tipo CreateProveedorData
        const payload: CreateProveedorData = {
          Nombre_Proveedor: validation.data.Nombre_Proveedor,
          Telefono_Proveedor: validation.data.Telefono_Proveedor,
          Tipo_Identificacion: validation.data.Tipo_Identificacion,
          Identificacion: validation.data.Identificacion,
          Id_Estado_Proveedor: 1, // Siempre activo al crear
        };

        // Usar el hook para crear el proveedor
        await createProveedorFisico(payload);
        
        showSuccess('¡Proveedor creado exitosamente!');
        handleClose();
        form.reset();
      } catch (error) {
        handleApiError(error);
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

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <LuUserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Registrar Nuevo Proveedor</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
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

            {/* Tipo de Identificación */}
            <form.Field name="Tipo_Identificacion">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Identificación *
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Tipo_Identificacion || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Seleccionar tipo de identificación</option>
                    {TIPOS_IDENTIFICACION_OPTIONS.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Tipo_Identificacion && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Tipo_Identificacion}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Identificación */}
            <form.Field name="Identificacion">
              {(field) => (
                <form.Field name="Tipo_Identificacion">
                  {(tipoField) => {
                    const tipoSeleccionado = tipoField.state.value;
                    const isValidTipo = tipoSeleccionado && tipoSeleccionado !== '';
                    
                    // Obtener límite específico según tipo seleccionado
                    const maxLength = isValidTipo && tipoSeleccionado in IDENTIFICACION_LIMITS_BY_TYPE 
                      ? IDENTIFICACION_LIMITS_BY_TYPE[tipoSeleccionado as keyof typeof IDENTIFICACION_LIMITS_BY_TYPE]
                      : IDENTIFICACION_LIMITS_BY_TYPE.default;
                    
                    const placeholder = isValidTipo && tipoSeleccionado in IDENTIFICACION_PLACEHOLDERS
                      ? `Ej: ${IDENTIFICACION_PLACEHOLDERS[tipoSeleccionado as keyof typeof IDENTIFICACION_PLACEHOLDERS]}` 
                      : IDENTIFICACION_PLACEHOLDERS.default;
                    
                    return (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Identificación *
                        </label>
                        <input
                          type="text"
                          value={field.state.value}
                          onChange={createInputHandler('Identificacion', field.handleChange, maxLength, tipoSeleccionado)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            (formErrors.Identificacion || field.state.meta.errors?.length) 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                          placeholder={placeholder}
                          maxLength={maxLength}
                          style={{ textTransform: 'uppercase' }}
                          disabled={!isValidTipo}
                        />
                        
                        {isValidTipo && (
                          <div className="mt-1">
                            <span className="text-xs text-blue-600">
                              {tipoSeleccionado === 'Cedula Nacional' && `Formato: exactamente ${IDENTIFICACION_LIMITS_BY_TYPE['Cedula Nacional']} dígitos, no puede empezar con 0`}
                              {tipoSeleccionado === 'Dimex' && `Formato: exactamente ${IDENTIFICACION_LIMITS_BY_TYPE['Dimex']} dígitos, no puede empezar con 0`}
                              {tipoSeleccionado === 'Pasaporte' && `Formato: 6-${IDENTIFICACION_LIMITS_BY_TYPE['Pasaporte']} caracteres (obligatorio), al menos 1 letra, máximo 3 letras`}
                            </span>
                          </div>
                        )}
                        
                        {renderCharCounter(
                          fieldCharCounts.Identificacion, 
                          maxLength, 
                          !!(formErrors.Identificacion || field.state.meta.errors?.length)
                        )}
                        
                        {field.state.meta.errors?.map((err) => (
                          <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                        ))}
                        {formErrors.Identificacion && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.Identificacion}</p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              )}
            </form.Field>

            {/* Teléfono */}
            <form.Field name="Telefono_Proveedor">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <PhoneInput
                    defaultCountry="CR"
                    international
                    countryCallingCodeEditable={false}
                    value={field.state.value}
                    onChange={(value) => {
                      const phoneValue = value || '';
                      field.handleChange(phoneValue);
                      setFieldCharCounts(prev => ({ 
                        ...prev, 
                        Telefono_Proveedor: phoneValue.length 
                      }));
                      validateFieldRealTime('Telefono_Proveedor', phoneValue);
                    }}
                    className={`react-phone-number-input ${
                      (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                        ? 'react-phone-number-input--error' 
                        : ''
                    }`}
                    style={{
                      '--PhoneInput-color--focus': '#3b82f6',
                      '--PhoneInputCountrySelect-marginRight': '0.5rem',
                      '--PhoneInputCountryFlag-aspectRatio': '1.5',
                      '--PhoneInputCountryFlag-height': '1rem',
                      '--PhoneInputCountrySelectArrow-color': '#6b7280',
                      '--PhoneInputCountrySelectArrow-color--focus': '#3b82f6',
                    } as React.CSSProperties}
                    inputProps={{
                      autoComplete: 'tel',
                      'aria-label': 'Número de teléfono internacional',
                      className: `w-full px-3 py-2 border rounded-r-lg focus:ring-2 focus:border-transparent transition-colors ${
                        (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`,
                      placeholder: 'Número de teléfono'
                    }}
                    countrySelectProps={{
                      'aria-label': 'Seleccionar país',
                      className: `border rounded-l-lg px-2 py-2 bg-white hover:bg-gray-50 focus:ring-2 focus:border-transparent transition-colors ${
                        (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`
                    }}
                  />
                  
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      Seleccione país y ingrese su número
                    </span>
                    <span className={`text-xs ${
                      field.state.value && isValidPhoneNumber(field.state.value) 
                        ? 'text-green-600' 
                        : field.state.value 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                    }`}>
                      {field.state.value 
                        ? (isValidPhoneNumber(field.state.value) ? '✓ Válido' : '✗ Inválido')
                        : 'Pendiente'
                      }
                    </span>
                  </div>
                  
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Telefono_Proveedor && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Telefono_Proveedor}</p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isCreating 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700' 
                }`}
              >
                {isCreating ? 'Creando...' : 'Crear Proveedor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModalProveedor;
