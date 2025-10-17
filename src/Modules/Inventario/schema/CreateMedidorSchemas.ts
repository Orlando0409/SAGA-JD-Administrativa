import { z } from 'zod';

export const CreateMedidorSchema = z.object({
  Numero_Medidor: z
    .number({
      required_error: 'El número del medidor es requerido',
      invalid_type_error: 'El número del medidor debe ser un número',
    })
    .int('El número del medidor debe ser un número entero')
    .positive('El número del medidor debe ser positivo')
    .min(1, 'El número del medidor debe ser mayor a 0'),
});

export type CreateMedidorSchemaData = z.infer<typeof CreateMedidorSchema>;