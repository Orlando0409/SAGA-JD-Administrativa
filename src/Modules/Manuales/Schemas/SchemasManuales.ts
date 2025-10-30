import { z } from "zod";

// ✅ Esquema para crear manual
export const CreateManualSchema = z.object({
  Nombre_Manual: z
    .string({
      required_error: "El nombre es obligatorio.",
      invalid_type_error: "El nombre debe ser una cadena de texto.",
    })
    .nonempty("El nombre no puede estar vacío.")
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(100, "El nombre no puede tener más de 100 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/,
      "El nombre solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"
    )
    .transform((value) =>
      value.trim()
        ? value.trim()[0].toUpperCase() + value.trim().slice(1).toLowerCase()
        : value
    ),

  PDF_Manual: z
    .instanceof(File, { message: "Debes subir un archivo PDF." })
    .refine((file) => file.type === "application/pdf", {
      message: "El archivo debe ser un PDF válido.",
    })
   
});

// ✅ Esquema para actualizar manual
export const UpdateManualSchema = z.object({
  Nombre_Manual: z
    .string({
      required_error: "El nombre es obligatorio.",
      invalid_type_error: "El nombre debe ser una cadena de texto.",
    })
    .nonempty("El nombre no puede estar vacío.")
    .min(5, "El nombre debe tener al menos 5 caracteres.")
    .max(100, "El nombre no puede tener más de 100 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/,
      "El nombre solo puede contener letras, números, espacios y los caracteres !?¿¡().,-"
    )
    .transform((value) =>
      value.trim()
        ? value.trim()[0].toUpperCase() + value.trim().slice(1).toLowerCase()
        : value
    ),

  PDF_Manual: z
    .any()
    .refine(
      (file) =>
        file === undefined ||
        file === null ||
        file instanceof File ||
        typeof file === "string",
      {
        message: "El archivo debe ser un PDF válido o una URL existente.",
      }
    )
    .refine(
      (file) =>
        !file ||
        typeof file === "string" ||
        (file instanceof File && file.type === "application/pdf"),
      {
        message: "El archivo debe ser un PDF válido.",
      }
    )
});

