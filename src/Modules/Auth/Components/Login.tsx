import { useForm } from '@tanstack/react-form';
import { LoginSchema, type LoginData } from '../schema/LoginSchema';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useLogin } from '../Hooks/AuthHook';

export default function LoginForm() {
  const mutation = useLogin();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: {
      Nombre_Usuario: '',
      Password: '',
    },

    onSubmit: async ({ value }: { value: LoginData }) => {
      setFormErrors({});

      const validation = LoginSchema.safeParse(value);

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
        await mutation.mutateAsync({
          Nombre_Usuario: value.Nombre_Usuario,
          Password: value.Password,
        });
      } catch (err: unknown) {
        console.error('Error de inicio de sesión:', err);
        setFormErrors({
          general: 'Credenciales incorrectas o error en el servidor',
        });
      }
    },
  });

  return (
    <div className="min-h-screen min-w-screen flex bg-gray-100">

      {/* Imagen - Solo visible en tablet y desktop (osea md y superiores) */}
      <div className="hidden md:block md:w-[50vw] bg-cover bg-center">
        <img
          src="\ASADA_JUAN_D.png"
          alt="Imagen"
          className="w-full h-full object-cover rounded-xl shadow-2xl"
        />
      </div>

      {/* Formulario - Ocupa toda la pantalla en móvil, 50% en desktop */}
      <div className="w-full md:w-[50vw] flex items-center justify-center bg-whitesmoke">
        <div className="w-full max-w-sm p-8 rounded-xl shadow-lg flex flex-col items-center bg-gray-200">
          {/* Logo arriba */}
          <div className="w-30 h-30 flex justify-center mb-4">
            <img
              src="/Logo_ASADA_Juan_Díaz.png"
              alt="Logo"
              className="w-full h-full rounded-full"
            />
          </div>

          <h2 className="text-2xl font-bold text-center text-sky-600 mb-6">
            Acceder
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4 w-full"
          >
            <form.Field name="Nombre_Usuario">
              {(field) => (
                <div>
                  <label htmlFor="Nombre_Usuario" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de Usuario
                    <p className="inline text-red-500 pl-1">*</p>
                  </label>
                  <input
                    id="Nombre_Usuario"
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Nombre de Usuario"
                    className="w-full text-black p-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <form.Field name="Password">
              {(field) => (
                <div>
                  <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                    <p className="inline text-red-500 pl-1">*</p>
                  </label>
                  <input
                    id="Password"
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full text-black p-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {field.state.meta.errors?.map((err) => (
                    <p key={err} className="text-red-500 text-sm">
                      {err}
                    </p>
                  ))}
                  {formErrors.Password && (
                    <p className="text-red-500 text-sm">
                      {formErrors.Password}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {formErrors.general && (
              <p className="text-red-500 text-sm">{formErrors.general}</p>
            )}

            <div className="flex items-center justify-between mt-4">
              <Link
                to="/ForgotPassword"
                className="text-sm text-gray-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-blue-900 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-sm"
              >
                {mutation.isPending ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}