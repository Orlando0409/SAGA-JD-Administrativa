import z from 'zod';

export const UpdateCategoriaMaterialSchema = z.object({
  Nombre_Categoria: z.string()
    .min(2, "La categoría debe tener al menos 2 caracteres")
    .max(30, "La categoría no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "La categoría solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional(),
  Descripcion_Categoria: z.string()
    .max(100, "La descripción no puede tener más de 100 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional()
});

export type UpdateCategoriaMaterialSchemaData = z.infer<typeof UpdateCategoriaMaterialSchema>;