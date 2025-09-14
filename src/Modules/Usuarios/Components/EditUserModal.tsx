import { useForm } from '@tanstack/react-form';
import { useUpdateUser } from '../Hooks/userHook';
import type { UpdateUserData } from '../Models/Usuario';
import { useRoles } from '@/Modules/Roles/Hooks/RoleHook';
import { EMAIL_MAX_LENGTH, NOMBRE_MAX_LENGTH, type EditUserModalProps } from '../Types/UserTypes';
import { useState } from 'react';
import { UpdateUserSchema, type UpdateUserSchemaData } from '../Schema/UpdateUserSchema';
import type { Role } from '@/Modules/Roles/Models/Role';
import { useAlerts } from '@/Modules/Global/context/AlertContext';


const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const updateUserMutation = useUpdateUser();
  const { data: roles = [] } = useRoles();
  const {showSuccess, showError} = useAlerts();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldCharCounts, setFieldCharCounts] = useState({
      nombreUsuario: 0,
      email: 0
    });

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
      Nombre_Usuario: user.Nombre_Usuario,
      Correo_Electronico: user.Correo_Electronico,
      Contraseña: '',
      Id_Rol: user.Id_Rol,
    },
    onSubmit: async ({ value }: { value: UpdateUserSchemaData }) => {
      setFormErrors({});
  
        const validation = UpdateUserSchema.safeParse(value);
  
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
        const updateData: UpdateUserData = {
          Nombre_Usuario: value.Nombre_Usuario,
          Correo_Electronico: value.Correo_Electronico,
          Id_Rol: value.Id_Rol
        };

        await updateUserMutation.mutateAsync({ Id_Usuario: user.Id_Usuario, userData: updateData });
        showSuccess('Usuario actualizado exitosamente');
        onClose();
      } catch (error) {
        console.error('Error updating user:', error);
        showError('Error al actualizar usuario');
      }
    },
  });

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Usuario</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="p-6 space-y-4"
        >
          <form.Field name="Nombre_Usuario">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={createInputHandler('nombreUsuario', field.handleChange, NOMBRE_MAX_LENGTH)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    (formErrors.Nombre_Usuario || field.state.meta.errors?.length) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder={`Nombre de Usuario`}
                  maxLength={NOMBRE_MAX_LENGTH}
                />
                
                {renderCharCounter(
                  fieldCharCounts.nombreUsuario, 
                  NOMBRE_MAX_LENGTH, 
                  !!(formErrors.Nombre_Usuario || field.state.meta.errors?.length)
                )}

                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                ))}
                {formErrors.Nombre_Usuario && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.Nombre_Usuario}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="Correo_Electronico">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={createInputHandler('email', field.handleChange, EMAIL_MAX_LENGTH)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    (formErrors.Correo_Electronico || field.state.meta.errors?.length) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="ejemplo@correo.com"
                  maxLength={EMAIL_MAX_LENGTH}
                />
                
                {renderCharCounter(
                  fieldCharCounts.email, 
                  EMAIL_MAX_LENGTH, 
                  !!(formErrors.Correo_Electronico || field.state.meta.errors?.length)
                )}
                
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                ))}
                {formErrors.Correo_Electronico && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.Correo_Electronico}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="Id_Rol">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    (formErrors.id_rol || field.state.meta.errors?.length) 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value={0}>Seleccionar rol</option>
                  {roles.map((rol: Role) => (
                    <option key={rol.Id_Rol} value={rol.Id_Rol}>
                      {rol.Nombre_Rol}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-xs mt-1">{err}</p>
                ))}
                {formErrors.id_rol && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.id_rol}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                updateUserMutation.isPending 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700' 
              }`}
            >
              {updateUserMutation.isPending ? 'Actualizando...' : 'Actualizar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;