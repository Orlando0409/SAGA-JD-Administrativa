import { z } from "zod";

// Esquema para crear una nueva imagen
export const CreateImagenSchema = z.object({
  Nombre_Imagen: z
    .string()
    .nonempty("El nombre de la imagen es obligatorio.")
    .max(50, "El nombre no puede superar los 50 caracteres.")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras y espacios.")
    .refine((val) => val.trim().length > 0, {
      message: "El nombre no puede estar vacío o solo contener espacios.",
    }),

  Imagen: z
    .instanceof(File, { message: "Debe seleccionar una imagen válida." })
    .optional(), // Se puede marcar como opcional para el caso de edición
});

// ✅ Esquema para actualizar una imagen existente
export const UpdateImagenSchema = z.object({
  Nombre_Imagen: z
    .string()
    .nonempty("El nombre de la imagen es obligatorio.")
    .max(50, "El nombre no puede superar los 50 caracteres.")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "El nombre solo puede contener letras y espacios.")
    .refine((val) => val.trim().length > 0, {
      message: "El nombre no puede estar vacío o solo contener espacios.",
    }),

  Imagen: z
    .instanceof(File, { message: "Debe seleccionar una imagen válida." })
    .optional(),
});

// ✅ Tipos inferidos (útiles para formularios o props)
export type CreateImagenForm = z.infer<typeof CreateImagenSchema>;
export type UpdateImagenForm = z.infer<typeof UpdateImagenSchema>;
