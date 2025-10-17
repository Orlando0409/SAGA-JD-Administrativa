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

export const UpdateEstadoMedidorSchema = z.object({
  Id_Estado_Medidor: z
    .number({
      required_error: 'El estado del medidor es requerido',
    })
    .int()
    .min(1, 'Debe seleccionar un estado válido')
    .max(3, 'Debe seleccionar un estado válido'),
});

export type CreateMedidorSchemaData = z.infer<typeof CreateMedidorSchema>;
export type UpdateEstadoMedidorSchemaData = z.infer<typeof UpdateEstadoMedidorSchema>;