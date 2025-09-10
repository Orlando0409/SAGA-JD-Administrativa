import z from "zod";

// Esquema de validación
export const passwordSchema = z.object({
  nuevaContraseña: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/\d/, "Debe contener al menos un número"),
  confirmarContraseña: z.string(),
}).refine((data) => data.nuevaContraseña === data.confirmarContraseña, {
  message: "Las contraseñas no coinciden",
  path: ["confirmarContraseña"],
});

export type NewPasswordData = z.infer<typeof passwordSchema>;