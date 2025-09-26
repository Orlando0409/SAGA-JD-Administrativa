import { z } from "zod";

export const ActaSchema = z.object({
    Titulo: z
        .string()
        .trim()
        .min(5, { message: "El título debe tener al menos 5 caracteres" })
        .max(100, { message: "El título no puede tener más de 100 caracteres" })
        .nonempty({ message: "El título no puede estar vacío" }),
    Descripcion: z
        .string()
        .trim()
        .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
        .max(500, { message: "La descripción no puede tener más de 500 caracteres" })
        .nonempty({ message: "La descripción no puede estar vacía" }),
    Id_Usuario: z
        .number()
        .int()
        .positive({ message: "El Id del usuario debe ser un número positivo" }),
});

export type ActaSchemaType = z.infer<typeof ActaSchema>;