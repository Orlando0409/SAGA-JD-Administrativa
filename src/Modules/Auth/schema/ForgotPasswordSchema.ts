import z from 'zod';

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "El correo electrónico es requerido").email("El correo electrónico no es válido").max(100),
});

export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;