// src/Modules/QuejasSugerenciasReportes/components/FormularioReporte.tsx
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useCreateReporte } from '../hook/HookContacto';

// Schema de validación
const reporteSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  primerApellido: z.string().min(1, 'Primer apellido es requerido'),
  segundoApellido: z.string().optional(),
  ubicacion: z.string().min(1, 'Ubicación es requerida'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
  adjunto: z.instanceof(File).optional(),
});

const FormularioReporte = () => {
  const [formKey, setFormKey] = useState<number>(0);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const mutation = useCreateReporte();

  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  const defaultValues = {
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    ubicacion: '',
    mensaje: '',
    adjunto: undefined,
  };

  const form = useForm({
    defaultValues: defaultValues as any,
    onSubmit: async ({ value }) => {
      setFormErrors({});

      const validation = reporteSchema.safeParse(value);
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
        await mutation.mutateAsync(value as any);
        setFormKey((prev) => prev + 1);
        setArchivoSeleccionado(null);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        setFormErrors({
          general: 'Hubo un error al enviar el formulario. \nPor favor intenta nuevamente.'
        });
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-7">
      <form
        key={formKey}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-md max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu Reporte
        </h2>

        <form.Field name="nombre">
          {(field) => (
            <div className="mb-4">
              <div className="flex gap-2">
                <label className="block mb-1 font-medium">Nombre completo</label>
                <p className="inline text-red-500">*</p>
              </div>
              <input
                id={field.name}
                type="text"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Nombre completo"
                className={commonClasses}
              />
              {formErrors.nombre && (
                <span className="text-red-500 text-sm">{formErrors.nombre}</span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="primerApellido">
          {(field) => (
            <div className="mb-4">
              <div className="flex gap-2">
                <label className="block mb-1 font-medium">Primer apellido</label>
                <p className="inline text-red-500">*</p>
              </div>
              <input
                id={field.name}
                type="text"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Primer apellido"
                className={commonClasses}
              />
              {formErrors.primerApellido && (
                <span className="text-red-500 text-sm">{formErrors.primerApellido}</span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="segundoApellido">
          {(field) => (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Segundo apellido</label>
              <input
                id={field.name}
                type="text"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Segundo apellido (opcional)"
                className={commonClasses}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="ubicacion">
          {(field) => (
            <div className="mb-4">
              <div className="flex gap-2">
                <label className="block mb-1 font-medium">Ubicación del lugar afectado</label>
                <p className="inline text-red-500">*</p>
              </div>
              <input
                id={field.name}
                type="text"
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ubicación del lugar afectado"
                className={commonClasses}
              />
              {formErrors.ubicacion && (
                <span className="text-red-500 text-sm">{formErrors.ubicacion}</span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="mensaje">
          {(field) => (
            <div className="mb-4">
              <div className="flex gap-2">
                <label className="block mb-1 font-medium">Descripción del reporte</label>
                <p className="inline text-red-500">*</p>
              </div>
              <textarea
                id={field.name}
                value={field.state.value as string}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descripción del reporte"
                className={`${commonClasses} h-28 resize-none`}
              />
              {formErrors.mensaje && (
                <span className="text-red-500 text-sm">{formErrors.mensaje}</span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="adjunto">
          {(field) => (
            <div className="w-full mb-4" key={field.name}>
              <label htmlFor="adjunto" className="block mb-1 font-medium">
                Adjuntar imagen (Opcional)
              </label>
              <input
                id="adjunto"
                type="file"
                accept=".png,.jpg,.jpeg,.heic"
                disabled={!!archivoSeleccionado}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? undefined;
                  field.handleChange(file as any);
                  setArchivoSeleccionado(file ?? null);
                }}
                className="hidden"
              />
              <label
                htmlFor="adjunto"
                className={`
                  inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm
                  ${archivoSeleccionado ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}
                  mb-2
                `}
              >
                {archivoSeleccionado ? 'Archivo cargado' : 'Subir archivo'}
              </label>
              {archivoSeleccionado && (
                <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2">
                  <div className="flex flex-wrap text-[.55rem] justify-between items-center sm:text-sm md:text-md lg:text-lg">
                    <span>{archivoSeleccionado.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        form.setFieldValue('adjunto' as any, undefined);
                        setArchivoSeleccionado(null);
                      }}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </form.Field>

        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {formErrors.general}
          </div>
        )}

        <div className="flex justify-end items-end mt-6">
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className={`
              w-[120px] py-2 rounded transition
              ${form.state.isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-900 hover:bg-blue-800'
              } text-white
            `}
          >
            {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioReporte;
