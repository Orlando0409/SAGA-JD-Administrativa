import z from 'zod';

export const IngresoMaterialSchema = z.object({
  Id_Material: z.number()
    .min(1, "Debe seleccionar un material"),
    
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(100000, "La cantidad no puede ser mayor a 100,000")
    .int("La cantidad debe ser un número entero"),
    
  Fecha_Ingreso: z.string()
    .min(1, "La fecha de ingreso es requerida"),
    
  Motivo: z.string()
    .min(1, "El motivo es requerido")
    .max(200, "El motivo no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "El motivo solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
});

export const EgresoMaterialSchema = z.object({
  Id_Material: z.number()
    .min(1, "Debe seleccionar un material"),
    
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(100000, "La cantidad no puede ser mayor a 100,000")
    .int("La cantidad debe ser un número entero"),
    
  Fecha_Egreso: z.string()
    .min(1, "La fecha de egreso es requerida"),
    
  Motivo: z.string()
    .min(1, "El motivo es requerido")
    .max(200, "El motivo no puede tener más de 200 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]*$/, "El motivo solo puede contener letras, números, espacios y los caracteres !?¿¡().,-")
});

export type IngresoMaterialSchemaData = z.infer<typeof IngresoMaterialSchema>;
export type EgresoMaterialSchemaData = z.infer<typeof EgresoMaterialSchema>;