import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { LuX, LuUserPlus } from 'react-icons/lu';

// Tipos de identificación disponibles
const TIPOS_IDENTIFICACION = [
  { value: 'Cedula', label: 'Cédula' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'Dimex', label: 'DIMEX' },
];

// Estados de proveedor disponibles (simulado - luego se puede obtener de una API)
const ESTADOS_PROVEEDOR = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
  { id: 3, nombre: 'Pendiente' },
];

// Límites de caracteres
const NOMBRE_MAX_LENGTH = 100;
const TELEFONO_MAX_LENGTH = 20;
const IDENTIFICACION_MAX_LENGTH = 20;

interface CreateModalProveedorProps {
  onClose: () => void;
  setShowCreateModal?: (show: boolean) => void;
}

const CreateModalProveedor = ({ onClose, setShowCreateModal }: CreateModalProveedorProps) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldCharCounts, setFieldCharCounts] = useState({
    nombreProveedor: 0,
    telefono: 0,
    identificacion: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (onClose) onClose();
    if (setShowCreateModal) setShowCreateModal(false);
  };

  // Función para crear el handler de input con validación
  const createInputHandler = (fieldName: string, handleChange: (value: string) => void, maxLength: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      // Limitar caracteres al máximo permitido
      if (value.length <= maxLength) {
        handleChange(value);
        setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));
        
        // Limpiar errores de validación cuando el usuario empieza a escribir
        if (formErrors[fieldName]) {
          setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
        }
      }
    };
  };

  const form = useForm({
    defaultValues: {
      Nombre_Proveedor: '',
      Telefono_Proveedor: '',
      Tipo_Identificacion: '',
      Identificacion: '',
      Id_Estado_Proveedor: 0,
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      setIsSubmitting(true);

      // Validaciones básicas
      const errors: Record<string, string> = {};

      if (!value.Nombre_Proveedor.trim()) {
        errors.Nombre_Proveedor = 'El nombre del proveedor es requerido';
      }

      if (!value.Telefono_Proveedor.trim()) {
        errors.Telefono_Proveedor = 'El teléfono es requerido';
      }

      if (!value.Tipo_Identificacion) {
        errors.Tipo_Identificacion = 'El tipo de identificación es requerido';
      }

      if (!value.Identificacion.trim()) {
        errors.Identificacion = 'La identificación es requerida';
      }

      if (value.Id_Estado_Proveedor === 0) {
        errors.Id_Estado_Proveedor = 'Debe seleccionar un estado';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      try {
        // TODO: Aquí se implementará la llamada al servicio de creación
        console.log('Datos del proveedor a crear:', value);
        
        // Simulamos una llamada async
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert('Proveedor creado exitosamente (simulado)');
        handleClose();
        form.reset();
      } catch (error) {
        console.error('Error creating proveedor:', error);
        alert('Error al crear el proveedor');
      } finally {
        setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
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
                    onChange={createInputHandler('nombreProveedor', field.handleChange, NOMBRE_MAX_LENGTH)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Nombre_Proveedor || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ingrese el nombre del proveedor"
                    maxLength={NOMBRE_MAX_LENGTH}
                  />
                  
                  {renderCharCounter(
                    fieldCharCounts.nombreProveedor, 
                    NOMBRE_MAX_LENGTH, 
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
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Tipo_Identificacion || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Seleccionar tipo de identificación</option>
                    {TIPOS_IDENTIFICACION.map((tipo) => (
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Identificación *
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={createInputHandler('identificacion', field.handleChange, IDENTIFICACION_MAX_LENGTH)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Identificacion || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ingrese el número de identificación"
                    maxLength={IDENTIFICACION_MAX_LENGTH}
                  />
                  
                  {renderCharCounter(
                    fieldCharCounts.identificacion, 
                    IDENTIFICACION_MAX_LENGTH, 
                    !!(formErrors.Identificacion || field.state.meta.errors?.length)
                  )}
                  
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Identificacion && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Identificacion}</p>
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
                    onChange={createInputHandler('telefono', field.handleChange, TELEFONO_MAX_LENGTH)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Telefono_Proveedor || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ej: 8888-8888"
                    maxLength={TELEFONO_MAX_LENGTH}
                  />
                  
                  {renderCharCounter(
                    fieldCharCounts.telefono, 
                    TELEFONO_MAX_LENGTH, 
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

            {/* Estado del Proveedor */}
            <form.Field name="Id_Estado_Proveedor">
              {(field) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado del Proveedor *
                  </label>
                  <select
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      (formErrors.Id_Estado_Proveedor || field.state.meta.errors?.length) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value={0}>Seleccionar estado</option>
                    {ESTADOS_PROVEEDOR.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                  ))}
                  {formErrors.Id_Estado_Proveedor && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.Id_Estado_Proveedor}</p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700' 
                }`}
              >
                {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModalProveedor;
