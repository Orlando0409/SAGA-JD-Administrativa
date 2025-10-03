/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { LuX, LuUser, LuBuilding2 } from 'react-icons/lu';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { 
  CreateProveedorSchemaWithIdentificacionValidation, 
  type CreateProveedorSchemaData,
  VALIDATION_LIMITS,
  TIPOS_IDENTIFICACION_OPTIONS,
  IDENTIFICACION_PLACEHOLDERS,
  IDENTIFICACION_LIMITS_BY_TYPE,
  formatPhoneNumberInput
} from '../Schema/SchemaFisicoProveedor';
import {
  CreateProveedorJuridicoSchema,
  type CreateProveedorJuridicoSchemaData,
  JURIDICO_VALIDATION_LIMITS,
  formatPhoneNumberInput as formatPhoneNumberInputJuridico
} from '../Schema/SchemaProveedorJuridico';
import { useCreateProveedorFisico } from '../Hook/hookFisicoProveedor';
import { useCreateProveedorJuridico } from '../Hook/hookjuridicoproveedor';
import type { CreateProveedorData } from '../Models/TablaProveedo/tablaFisicoProveedor';
import type { CreateProveedorJuridicoData } from '../Models/TablaProveedo/tablaJuridicoProveedor';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

interface CreateModalProveedorProps {
  onClose: () => void;
  setShowCreateModal?: (show: boolean) => void;
}

type TipoProveedor = 'fisico' | 'juridico';

const CreateModalProveedor = ({ onClose, setShowCreateModal }: CreateModalProveedorProps) => {
  const [tipoProveedor, setTipoProveedor] = useState<TipoProveedor>('fisico');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    Nombre_Proveedor: 0,
    Telefono_Proveedor: 0,
    Identificacion: 0,
    Cedula_Juridica: 0,
    Razon_Social: 0
  });

  // Hook de alertas
  const { showSuccess, showError, showWarning } = useAlerts();

  // Hook para crear proveedor físico
  const { 
    createProveedorFisico, 
    isCreating: isCreatingFisico
  } = useCreateProveedorFisico();

  // Hook para crear proveedor jurídico
  const { 
    createProveedorJuridico, 
    isCreating: isCreatingJuridico
  } = useCreateProveedorJuridico();

  const isCreating = isCreatingFisico || isCreatingJuridico;

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (onClose) onClose();
    if (setShowCreateModal) setShowCreateModal(false);
  };

  // Función específica para manejar input de cédula jurídica
  const createCedulaJuridicaHandler = (fieldHandleChange: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Permitir solo dígitos y guiones
      value = value.replace(/[^\d-]/g, '');
      
      // Remover guiones para validar longitud (máximo 10 dígitos)
      const digitsOnly = value.replace(/-/g, '');
      if (digitsOnly.length > 10) {
        return; // No permitir más de 10 dígitos
      }
      
      // Actualizar contador de caracteres
      setFieldCharCounts(prev => ({
        ...prev,
        Cedula_Juridica: value.length
      }));
      
      // Llamar al handler del campo
      fieldHandleChange(value);
      
      // Validar en tiempo real
      validateFieldRealTime('Cedula_Juridica', value);
    };
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
              } else if (cleanValue.length > 0 && !/^[1-7]/.test(cleanValue)) {
                error = 'La cédula nacional debe comenzar con un número del 1 al 7';
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

      case 'Cedula_Juridica':
        if (value) {
          // Normalizar removiendo guiones para validación
          const normalizedValue = value.replace(/-/g, '').trim();
          
          // Validar que solo contenga dígitos después de la normalización
          if (!/^\d+$/.test(normalizedValue)) {
            error = 'La cédula jurídica debe contener solo dígitos';
          } else if (normalizedValue.length !== 10) {
            error = 'La cédula jurídica debe tener exactamente 10 dígitos';
          } else if (!/^[2345]\d{9}$/.test(normalizedValue)) {
            error = 'La cédula jurídica debe comenzar con 2, 3, 4 o 5';
          }
        }
        break;

      case 'Razon_Social':
        const razonSocial = value.trim();
        if (razonSocial && razonSocial.length >= 2) {
          if (razonSocial.length < 2) {
            error = 'La razón social debe tener al menos 2 caracteres';
          }
        }
        break;

      case 'Telefono_Proveedor':
        if (value) {
          if (!isValidPhoneNumber(value)) {
            error = 'Número de teléfono inválido para el país seleccionado';
          }
        }
        break;
    }

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
      
      if (value.length <= maxLength) {
        handleChange(value);
        setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));
        validateFieldRealTime(fieldName, value, tipoIdentificacion);
      }
    };
  };

  // Función para manejar errores de API específicos
  const handleApiError = (error: any) => {
    console.error('Error creating proveedor:', error);
    
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
      
      showWarning('⚠️ Ya existe un proveedor con esa identificación. Por favor, verifica la información ingresada.');
      return;
    }
    
    if (error?.response?.status === 400) {
      const errorMessage = error.response?.data?.message || 'Datos inválidos';
      showError(`Error de validación: ${errorMessage}`);
      return;
    }
    
    if (error?.response?.status >= 500) {
      showError('Error del servidor. Por favor, intenta nuevamente más tarde.');
      return;
    }
    
    const errorMessage = error?.message || 'Error desconocido al crear el proveedor';
    showError(`Error al crear el proveedor: ${errorMessage}`);
  };

  // Formulario para proveedor físico
  const formFisico = useForm({
    defaultValues: {
      Nombre_Proveedor: '',
      Telefono_Proveedor: '',
      Tipo_Identificacion: '' as any,
      Identificacion: '',
      Id_Estado_Proveedor: 1,
    },

    onSubmit: async ({ value }: { value: CreateProveedorSchemaData }) => {
      setFormErrors({});

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
        const payload: CreateProveedorData = {
          Nombre_Proveedor: validation.data.Nombre_Proveedor,
          Telefono_Proveedor: validation.data.Telefono_Proveedor,
          Tipo_Identificacion: validation.data.Tipo_Identificacion,
          Identificacion: validation.data.Identificacion,
          Id_Estado_Proveedor: 1,
        };

        await createProveedorFisico(payload);
        
        showSuccess('¡Proveedor físico creado exitosamente!');
        handleClose();
        formFisico.reset();
      } catch (error) {
        handleApiError(error);
      }
    },
  });

  // Formulario para proveedor jurídico
  const formJuridico = useForm({
    defaultValues: {
      Nombre_Proveedor: '',
      Telefono_Proveedor: '',
      Cedula_Juridica: '',
      Razon_Social: '',
      Id_Estado_Proveedor: 1,
    },

    onSubmit: async ({ value }: { value: CreateProveedorJuridicoSchemaData }) => {
      setFormErrors({});

      // Validar usando el schema de Zod específico para jurídicos
      const validation = CreateProveedorJuridicoSchema.safeParse(value);

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
        // Usar los datos validados del schema
        const payload: CreateProveedorJuridicoData = {
          Nombre_Proveedor: validation.data.Nombre_Proveedor,
          Telefono_Proveedor: validation.data.Telefono_Proveedor,
          Cedula_Juridica: validation.data.Cedula_Juridica,
          Razon_Social: validation.data.Razon_Social,
          Id_Estado_Proveedor: 1,
        };

        await createProveedorJuridico(payload);
        
        showSuccess('¡Proveedor jurídico creado exitosamente!');
        handleClose();
        formJuridico.reset();
      } catch (error) {
        handleApiError(error);
      }
    },
  });

  const form = tipoProveedor === 'fisico' ? formFisico : formJuridico;

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
            {tipoProveedor === 'fisico' ? (
              <LuUser className="w-6 h-6 text-blue-600" />
            ) : (
              <LuBuilding2 className="w-6 h-6 text-green-600" />
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              Registrar Proveedor {tipoProveedor === 'fisico' ? 'Físico' : 'Jurídico'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Botones para cambiar tipo de proveedor */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTipoProveedor('fisico');
                setFormErrors({});
                formFisico.reset();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoProveedor === 'fisico'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <LuUser className="w-4 h-4" />
              Físico
            </button>
            <button
              type="button"
              onClick={() => {
                setTipoProveedor('juridico');
                setFormErrors({});
                formJuridico.reset();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoProveedor === 'juridico'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <LuBuilding2 className="w-4 h-4" />
              Jurídico
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-140px)]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {tipoProveedor === 'fisico' ? (
              // FORMULARIO PARA PROVEEDOR FÍSICO
              <>
                {/* Nombre del Proveedor */}
                <form.Field name="Nombre_Proveedor">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(field: any) => (
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
                        <option value="">Seleccione un tipo de identificación</option>
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
                        const tipoIdentificacion = tipoField.state.value;
                        const maxLength = IDENTIFICACION_LIMITS_BY_TYPE[tipoIdentificacion as keyof typeof IDENTIFICACION_LIMITS_BY_TYPE] || VALIDATION_LIMITS.IDENTIFICACION_MAX_LENGTH;
                        const placeholder = IDENTIFICACION_PLACEHOLDERS[tipoIdentificacion as keyof typeof IDENTIFICACION_PLACEHOLDERS] || 'Ingrese la identificación';

                        return (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {tipoIdentificacion ? `${tipoIdentificacion} *` : 'Identificación *'}
                            </label>
                            <input
                              type="text"
                              value={field.state.value}
                              onChange={createInputHandler('Identificacion', field.handleChange, maxLength, tipoIdentificacion)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (formErrors.Identificacion || field.state.meta.errors?.length) 
                                  ? 'border-red-300 focus:ring-red-500' 
                                  : 'border-gray-300 focus:ring-blue-500'
                              }`}
                              placeholder={placeholder}
                              maxLength={maxLength}
                              disabled={!tipoIdentificacion}
                            />
                            
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
                        value={field.state.value}
                        onChange={(value) => {
                          // Formatear el número en tiempo real
                          const formattedValue = formatPhoneNumberInput(value || '');
                          field.handleChange(formattedValue);
                          validateFieldRealTime('Telefono_Proveedor', value || '');
                        }}
                        defaultCountry="CR"
                        placeholder="Ingrese el número de teléfono"
                        className={`phone-input ${
                          (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                            ? 'phone-input-error' 
                            : 'phone-input-success'
                        }`}
                      />
                      {field.state.meta.errors?.map((err) => (
                        <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                      ))}
                      {formErrors.Telefono_Proveedor && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.Telefono_Proveedor}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </>
            ) : (
              // FORMULARIO PARA PROVEEDOR JURÍDICO
              <>
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
                        onChange={createInputHandler('Nombre_Proveedor', field.handleChange, JURIDICO_VALIDATION_LIMITS.NOMBRE_MAX_LENGTH)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          formErrors.Nombre_Proveedor
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        placeholder="Ingrese el nombre del proveedor (mín. 2 caracteres)"
                        maxLength={JURIDICO_VALIDATION_LIMITS.NOMBRE_MAX_LENGTH}
                      />
                      
                      {renderCharCounter(
                        fieldCharCounts.Nombre_Proveedor, 
                        JURIDICO_VALIDATION_LIMITS.NOMBRE_MAX_LENGTH, 
                        !!formErrors.Nombre_Proveedor
                      )}

                      {formErrors.Nombre_Proveedor && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Proveedor}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Cédula Jurídica */}
                <form.Field name="Cedula_Juridica">
                  {(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cédula Jurídica *
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={createCedulaJuridicaHandler(field.handleChange)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          formErrors.Cedula_Juridica
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        placeholder="Ej: 3-101-654321 (10 dígitos, inicia con 2,3,4 o 5)"
                        maxLength={JURIDICO_VALIDATION_LIMITS.CEDULA_JURIDICA_MAX_LENGTH}
                      />
                      
                      {renderCharCounter(
                        fieldCharCounts.Cedula_Juridica, 
                        JURIDICO_VALIDATION_LIMITS.CEDULA_JURIDICA_MAX_LENGTH, 
                        !!formErrors.Cedula_Juridica
                      )}

                      {formErrors.Cedula_Juridica && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.Cedula_Juridica}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Razón Social */}
                <form.Field name="Razon_Social">
                  {(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Razón Social *
                      </label>
                      <input
                        type="text"
                        value={field.state.value}
                        onChange={createInputHandler('Razon_Social', field.handleChange, JURIDICO_VALIDATION_LIMITS.RAZON_SOCIAL_MAX_LENGTH)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          formErrors.Razon_Social
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-green-500'
                        }`}
                        placeholder="Ingrese la razón social (mín. 2 caracteres)"
                        maxLength={JURIDICO_VALIDATION_LIMITS.RAZON_SOCIAL_MAX_LENGTH}
                      />
                      
                      {renderCharCounter(
                        fieldCharCounts.Razon_Social, 
                        JURIDICO_VALIDATION_LIMITS.RAZON_SOCIAL_MAX_LENGTH, 
                        !!formErrors.Razon_Social
                      )}

                      {formErrors.Razon_Social && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.Razon_Social}</p>
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
                      <PhoneInput
                        value={field.state.value}
                        onChange={(value) => {
                          // Formatear el número en tiempo real
                          const formattedValue = formatPhoneNumberInputJuridico(value || '');
                          field.handleChange(formattedValue);
                          validateFieldRealTime('Telefono_Proveedor', value || '');
                        }}
                        defaultCountry="CR"
                        placeholder="Ingrese el número de teléfono"
                        className={`phone-input ${
                          formErrors.Telefono_Proveedor
                            ? 'phone-input-error' 
                            : 'phone-input-success-juridico'
                        }`}
                      />
                      {formErrors.Telefono_Proveedor && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.Telefono_Proveedor}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </>
            )}

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
                    ? `${tipoProveedor === 'fisico' ? 'bg-blue-300' : 'bg-green-300'} cursor-not-allowed` 
                    : `${tipoProveedor === 'fisico' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}` 
                }`}
              >
                {isCreating ? 'Creando...' : `Crear Proveedor ${tipoProveedor === 'fisico' ? 'Físico' : 'Jurídico'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModalProveedor;