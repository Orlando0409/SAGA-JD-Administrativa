import { z } from 'zod';

export const CreateMedidorSchema = z.object({
  Numero_Medidor: z
    .number({
      required_error: 'El número del medidor es requerido',
      invalid_type_error: 'El número del medidor debe ser un número',
    })
    .int('El número del medidor debe ser un número entero (sin letras, espacios ni caracteres especiales)')
    .min(100000, 'El número del medidor debe tener exactamente 6 dígitos')
    .max(999999, 'El número del medidor debe tener exactamente 6 dígitos'),
});

export type CreateMedidorSchemaData = z.infer<typeof CreateMedidorSchema>;