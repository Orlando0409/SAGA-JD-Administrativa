import z from 'zod';

export const CreateUnidadMedicionSchema = z.object({
  Nombre_Unidad_Medicion: z.string()
    .min(1, "El nombre de la unidad es requerido")
    .max(50, "El nombre de la unidad no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s().,-]+$/, "El nombre solo puede contener letras, números, espacios y los caracteres ().,-"),
  
  Abreviatura: z.string()
    .min(1, "La abreviatura es requerida")
    .max(10, "La abreviatura no puede tener más de 10 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, "La abreviatura solo puede contener letras y números"),
  
  Descripcion: z.string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional()
});

export type CreateUnidadMedicionSchemaData = z.infer<typeof CreateUnidadMedicionSchema>;