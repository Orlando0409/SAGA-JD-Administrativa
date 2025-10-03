import { z } from "zod";

export const CalidadAguaSchema = z.object({
  Titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(100, "El título no puede tener más de 100 caracteres.")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El título contiene caracteres no permitidos."),
    
  archivo: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true; // Opcional para edición
      return file.type === 'application/pdf';
    }, "Solo se permiten archivos PDF")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 10 * 1024 * 1024; // 10MB máximo
    }, "El archivo no puede ser mayor a 10MB")
});

// ✅ Esquema para actualización (todos los campos opcionales excepto ID)
export const CalidadAguaUpdateSchema = z.object({
  Id_Calidad_Agua: z.number(),
  Titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(100, "El título no puede tener más de 100 caracteres.")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/, "El título contiene caracteres no permitidos.")
    .optional(),
  
  archivo: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file.type === 'application/pdf';
    }, "Solo se permiten archivos PDF")
    .refine((file) => {
      if (!file) return true;
      return file.size <= 10 * 1024 * 1024;
    }, "El archivo no puede ser mayor a 10MB")
});

// ✅ Tipos TypeScript inferidos de los esquemas
export type CalidadAguaFormType = z.infer<typeof CalidadAguaSchema>;
export type CalidadAguaUpdateType = z.infer<typeof CalidadAguaUpdateSchema>;
