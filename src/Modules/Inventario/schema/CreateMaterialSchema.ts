import z from 'zod';

export const CreateMaterialSchema = z.object({
  Nombre_Material: z.string()
    .min(2, "El nombre del material debe tener al menos 2 caracteres")
    .max(50, "El nombre del material no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El nombre solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"),
  
  Descripcion: z.string().min(1,"Debe ingresar una descripción")
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"),
  
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .int("La cantidad debe ser un número entero"),
  
  Precio_Unitario: z.number()
    .min(0.10, "El precio unitario debe ser al menos 0.10"),
  
  IDS_Categorias: z.array(z.number())
    .optional()
});

export type CreateMaterialSchemaData = z.infer<typeof CreateMaterialSchema>;