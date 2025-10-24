import { z } from "zod";

// Esquema para crear una nueva FAQ
export const CreateFAQSchema = z.object({
  Pregunta: z
    .string()
    .nonempty("La pregunta es obligatoria.")
    .min(10, "La pregunta debe tener al menos 10 caracteres.")
    .max(100, "La pregunta no puede superar los 100 caracteres.")
    .refine((val) => val.trim().length > 0, {
      message: "La pregunta no puede estar vacía o solo contener espacios.",
    }),

  Respuesta: z
    .string()
    .nonempty("La respuesta es obligatoria.")
    .min(10, "La respuesta debe tener al menos 10 caracteres.")
    .max(700, "La respuesta no puede superar los 700 caracteres.")
    .refine((val) => val.trim().length > 0, {
      message: "La respuesta no puede estar vacía o solo contener espacios.",
    }),
});

// Esquema para actualizar una FAQ (campos opcionales)
export const UpdateFAQSchema = z.object({
  Pregunta: z
    .string()
    .min(10, "La pregunta debe tener al menos 10 caracteres.")
    .max(100, "La pregunta no puede superar los 100 caracteres.")
    .refine((val) => val.trim().length > 0, {
      message: "La pregunta no puede estar vacía o solo contener espacios.",
    })
    .optional(),

  Respuesta: z
    .string()
    .min(10, "La respuesta debe tener al menos 10 caracteres.")
    .max(700, "La respuesta no puede superar los 700 caracteres.")
    .refine((val) => val.trim().length > 0, {
      message: "La respuesta no puede estar vacía o solo contener espacios.",
    })
    .optional(),
});

// Tipos inferidos para usar en formularios o props
export type CreateFAQForm = z.infer<typeof CreateFAQSchema>;
export type UpdateFAQForm = z.infer<typeof UpdateFAQSchema>;
