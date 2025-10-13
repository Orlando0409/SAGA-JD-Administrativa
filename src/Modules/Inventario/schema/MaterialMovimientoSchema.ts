import z from 'zod';

// Schema for Ingreso/Egreso operations - matches backend DTO structure
export const IngresoEgresoMaterialSchema = z.object({
  Id_Material: z.number()
    .min(1, "Debe seleccionar un material"),
  
  Cantidad: z.number()
    .min(1, "La cantidad debe ser al menos 1")
    .max(100000, "La cantidad no puede ser mayor a 100,000")
    .int("La cantidad debe ser un número entero"),
  
  Observaciones: z.string()
    .max(250, "Las observaciones no pueden tener más de 250 caracteres")
    .optional()
});

// Kept for backward compatibility
export const IngresoMaterialSchema = IngresoEgresoMaterialSchema;
export const EgresoMaterialSchema = IngresoEgresoMaterialSchema;

export type IngresoEgresoMaterialSchemaData = z.infer<typeof IngresoEgresoMaterialSchema>;
export type IngresoMaterialSchemaData = z.infer<typeof IngresoMaterialSchema>;
export type EgresoMaterialSchemaData = z.infer<typeof EgresoMaterialSchema>;