import { useForm } from '@tanstack/react-form';
import { LuX } from "react-icons/lu";
import { useUpdateUser, useRoles } from '../Hooks/userHook';
import type { UpdateUserData, Usuario } from '../Models/Usuario';


interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const updateUserMutation = useUpdateUser();
  const { data: roles = [] } = useRoles();

  const form = useForm({
    defaultValues: {
      Nombre_Usuario: user.Nombre_Usuario,
      Correo_Electronico: user.Correo_Electronico,
      Contraseña: '',
      Id_Rol: user.Id_Rol,
    },
    onSubmit: async ({ value }) => {
      try {
        const updateData: UpdateUserData = {
          Id_Usuario: user.Id_Usuario,
          Nombre_Usuario: value.Nombre_Usuario,
          Correo_Electronico: value.Correo_Electronico,
          Contraseña: '',
          Id_Rol: value.Id_Rol
        };

        // Solo incluir Contraseña si se proporciona
        if (value.Contraseña.trim()) {
          updateData.Contraseña = value.Contraseña;
        }

        await updateUserMutation.mutateAsync(updateData);
        onClose();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Usuario</h2>
          <button
            onClick={onClose}
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
              </div>
            )}
          </form.Field>

          <form.Field name="Contraseña">
            {(field) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña{' '}
                  <span className="text-gray-500 text-xs ml-1">(dejar vacío para mantener actual)</span>
                </label>
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Dejar vacío para mantener actual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  {roles.map((rol: any) => (
                    <option key={rol.Id_Rol} value={rol.Id_Rol}>
                      {rol.Nombre_Rol}
                    </option>
                  ))}
                </select>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
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