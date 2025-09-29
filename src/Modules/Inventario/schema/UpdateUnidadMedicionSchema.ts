import z from 'zod';

export const UpdateUnidadMedicionSchema = z.object({
  Nombre_Unidad: z.string()
    .min(1, "El nombre de la unidad es requerido")
    .max(50, "El nombre de la unidad no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s().,-]+$/, "El nombre solo puede contener letras, números, espacios y los caracteres ().,-")
    .optional(),
  
  Descripcion: z.string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional(),
    
  Id_Estado_Unidad_Medicion: z.number()
    .min(1, "Debe seleccionar un estado para la unidad de medición")
    .optional()
});

export type UpdateUnidadMedicionSchemaData = z.infer<typeof UpdateUnidadMedicionSchema>;