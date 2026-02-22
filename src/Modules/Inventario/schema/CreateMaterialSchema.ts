import z from 'zod';

export const CreateMaterialSchema = z.object({
  Nombre_Material: z.string()
    .min(2, "El nombre del material debe tener al menos 2 caracteres")
    .max(50, "El nombre del material no puede tener más de 50 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El nombre solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"),
  
  Descripcion: z.string()
    .max(200, "La descripción no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "La descripción solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
    .optional(),
  
  Id_Unidad_Medicion: z.number()
    .min(1, "Debe seleccionar una unidad de medición"),
  
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(100000, "La cantidad no puede ser mayor a 100,000")
    .int("La cantidad debe ser un número entero"),
  
  Precio_Unitario: z.number()
    .min(5, "El precio unitario debe ser al menos 5")
    .max(10000000, "El precio unitario no puede ser mayor a 10,000,000"),
  
  Numero_Estanteria: z.number({
    required_error: "El número de estantería es requerido",
    invalid_type_error: "El número de estantería debe ser un número"
  })
    .min(1, "El número de estantería debe ser al menos 1")
    .max(50, "El número de estantería no puede ser mayor a 50")
    .int("El número de estantería debe ser un número entero"),

  
  IDS_Categorias: z.array(z.number())
    .optional(),

  Id_Tipo_Proveedor: z.number()
    .optional(),

  Id_Proveedor: z.number()
    .optional()
});

export type CreateMaterialSchemaData = z.infer<typeof CreateMaterialSchema>;