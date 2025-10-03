import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

// Esquema base para campos comunes (reutilizado del físico)
const BaseAfiliadoSchema = z.object({
  Correo: z.string()
    .min(1, 'El correo no puede estar vacío')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico debe tener un formato válido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El formato del correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono no puede estar vacío')
    .refine(
      (phone) => {
        const phoneNumber = parsePhoneNumberFromString(phone);
        return !!phoneNumber && phoneNumber.isValid();
      },
      { message: "Número de teléfono inválido" }
    ),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no puede tener más de 255 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#'),
});

export const AfiliacionJuridicaSchema = BaseAfiliadoSchema.extend({
  Cedula_Juridica: z.string()
    .min(1, 'La cédula jurídica no puede estar vacía')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede tener más de 100 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,&()-]+$/, 'La razón social solo puede contener letras, números, espacios y los caracteres .,&()-'),
    
  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
});