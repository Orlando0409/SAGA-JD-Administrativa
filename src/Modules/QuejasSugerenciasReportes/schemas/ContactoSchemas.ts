import { z } from 'zod';

export const RespuestaSchema = z.object({
  respuesta: z.string()
    .min(1, 'La respuesta no puede estar vacía')
    .max(150, 'no se puede enviar una respuesta de más de 150 caracteres'),
});

export type RespuestaType = z.infer<typeof RespuestaSchema>;
