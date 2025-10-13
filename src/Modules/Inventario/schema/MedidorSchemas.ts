import z from 'zod';

// Schema para crear medidor - coincide con CreateMedidorDTO del backend
export const CreateMedidorSchema = z.object({
  Numero_Medidor: z.number()
    .int("El número del medidor debe ser un número entero")
    .min(1, "El número del medidor debe ser un número positivo")
    .max(999999999, "El número del medidor no puede exceder 9 dígitos")
});

// Schema para asignar medidor a afiliado - coincide con AsignarMedidorDTO del backend
export const AsignarMedidorSchema = z.object({
  Id_Medidor: z.number()
    .int("El ID del medidor debe ser un número entero")
    .min(1, "Debe seleccionar un medidor válido"),
  
  Id_Tipo_Entidad: z.union([z.literal(1), z.literal(2)], {
    errorMap: () => ({ message: "El tipo de entidad debe ser 1 (Física) o 2 (Jurídica)" })
  }),
  
  Id_Afiliado: z.number()
    .int("El ID del afiliado debe ser un número entero")
    .min(1, "Debe seleccionar un afiliado válido")
});

export type CreateMedidorSchemaData = z.infer<typeof CreateMedidorSchema>;
export type AsignarMedidorSchemaData = z.infer<typeof AsignarMedidorSchema>;
