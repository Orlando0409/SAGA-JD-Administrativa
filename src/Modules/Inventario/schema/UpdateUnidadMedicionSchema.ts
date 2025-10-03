import z from 'zod';

export const UpdateUnidadMedicionSchema = z.object({
  // Match backend DTO field name exactly
  Nombre_Unidad_Medicion: z.string()
    .min(2, "El nombre de la unidad debe tener al menos 2 caracteres")
    .max(30, "El nombre de la unidad no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre de la unidad solo puede contener letras, números y espacios")
    .optional(),
  Abreviatura: z.string()
    .min(1, "La abreviatura debe tener al menos 1 carácter")
    .max(10, "La abreviatura no puede tener más de 10 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, "La abreviatura solo puede contener letras y números sin espacios")
    .optional(),
  
  Descripcion: z.string()
    .max(100, "La descripción no puede tener más de 100 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?¿¡()-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres .,!?¿¡()-")
    .optional()
});

export type UpdateUnidadMedicionSchemaData = z.infer<typeof UpdateUnidadMedicionSchema>;