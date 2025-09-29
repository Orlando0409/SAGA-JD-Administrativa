import z from 'zod';

export const UpdateMaterialSchema = z.object({
  Nombre_Material: z.string()
    .min(2, "El nombre del material debe tener al menos 2 caracteres")
    .max(50, "El nombre del material no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El nombre solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional(),
  
  Descripcion: z.string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional(),
    
  Id_Unidad_Medicion: z.number()
    .min(1, "Debe seleccionar una unidad de medición")
    .optional(),
  
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(100000, "La cantidad no puede ser mayor a 100,000")
    .int("La cantidad debe ser un número entero")
    .optional(),
  
  Precio_Unitario: z.number()
    .min(5, "El precio unitario debe ser al menos 5")
    .max(10000000, "El precio unitario no puede ser mayor a 10,000,000")
    .optional(),
  
  IDS_Categorias: z.array(z.number())
    .optional()
});

export type UpdateMaterialSchemaData = z.infer<typeof UpdateMaterialSchema>;