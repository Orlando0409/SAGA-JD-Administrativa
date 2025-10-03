import z from 'zod';

export const CreateCategoriaMaterialSchema = z.object({
  Nombre_Categoria: z.string()
    .min(2, "La categoría debe tener al menos 2 caracteres")
    .max(30, "La categoría no puede tener más de 30 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "La categoría solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"),
  Descripcion_Categoria: z.string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede tener más de 500 caracteres")
});

export type CreateCategoriaMaterialSchemaData = z.infer<typeof CreateCategoriaMaterialSchema>;