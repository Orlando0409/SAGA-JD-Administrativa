import { z } from 'zod';

export const CreateMedidorSchema = z.object({
  Numero_Medidor: z
    .number({
      required_error: 'El número del medidor es requerido',
      invalid_type_error: 'El número del medidor debe ser un número',
    })
    .int('El número del medidor debe ser un número entero')
    .min(100000, 'El número del medidor debe tener al menos 6 dígitos y no puede empezar con 0')
    .max(99999999, 'El número del medidor no puede tener más de 8 dígitos'),
});

export type CreateMedidorSchemaData = z.infer<typeof CreateMedidorSchema>;