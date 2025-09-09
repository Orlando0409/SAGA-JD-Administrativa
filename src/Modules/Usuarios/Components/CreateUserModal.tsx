import { useForm } from '@tanstack/react-form';
import { useCreateUser, useRoles } from '../Hooks/userHook';
import type { CreateUserData } from '../Models/Usuario';
import { useState } from 'react';
import { CreateUserSchema, type CreateUserSchemaData } from '../Schema/CreateUserSchema';
import { LuX } from "react-icons/lu";

type CreateUserProps = {
  onClose?: () => void;
  setShowCreateModal?: (show: boolean) => void;
};

const CreateUserModal = ({ onClose, setShowCreateModal }: CreateUserProps) => {
  const createUserMutation = useCreateUser();
  const { data: roles = [] } = useRoles();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Función para manejar el cierre del modal
  const handleClose = () => {
    if (onClose) onClose();
    if (setShowCreateModal) setShowCreateModal(false);
  };

  const form = useForm({
    defaultValues: {
      Nombre_Usuario: '',
      Correo_Electronico: '',
      Contraseña:'',
      confirmarPassword: '',
      Id_Rol: 0,
    },

    onSubmit: async ({ value }: { value: CreateUserSchemaData }) => {
      setFormErrors({});

      const validation = CreateUserSchema.safeParse(value);

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
        const payload = {
          Nombre_Usuario : value.Nombre_Usuario,
          Contraseña: value.Contraseña,
          Correo_Electronico: value.Correo_Electronico,
          Id_Rol: value.Id_Rol
        } as CreateUserData
        await createUserMutation.mutateAsync(payload);
        handleClose();
        form.reset();
      } catch (error) {
        console.error('Error creating user:', error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Usuario</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="p-6 space-y-4"
        >
          {/* Campos del formulario igual */}
          <form.Field name="Nombre_Usuario">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-sm">
                    {err}
                  </p>
                ))}
                {formErrors.Nombre_Usuario && (
                  <p className="text-red-500 text-sm">
                    {formErrors.Nombre_Usuario}
                  </p>
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-sm">
                    {err}
                  </p>
                ))}
                {formErrors.Correo_Electronico && (
                  <p className="text-red-500 text-sm">
                    {formErrors.Correo_Electronico}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="Contraseña">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-sm">
                    {err}
                  </p>
                ))}
                {formErrors.password && (
                  <p className="text-red-500 text-sm">
                    {formErrors.password}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmarPassword">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirme la Contraseña
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-sm">
                    {err}
                  </p>
                ))}
                {formErrors.confirmarPassword && (
                  <p className="text-red-500 text-sm">
                    {formErrors.confirmarPassword}
                  </p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Seleccionar rol</option>
                  {roles.map((rol: any) => (
                    <option key={rol.Id_Rol} value={rol.Id_Rol}>
                      {rol.Nombre_Rol}
                    </option>
                  ))}
                </select>
                {field.state.meta.errors?.map((err) => (
                  <p key={err} className="text-red-500 text-sm">
                    {err}
                  </p>
                ))}
                {formErrors.id_rol && (
                  <p className="text-red-500 text-sm">
                    {formErrors.id_rol}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {createUserMutation.isPending ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;