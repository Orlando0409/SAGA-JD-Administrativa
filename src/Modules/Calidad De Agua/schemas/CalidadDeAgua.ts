import { z } from "zod";

export const CalidadAguaSchema = z.object({
  Titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(100, "El título no puede tener más de 100 caracteres.")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El título contiene caracteres no permitidos."),
});