import { z } from 'zod'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const AfiliadoFisicoSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Apellido1: z.string().min(1, 'El primer apellido es obligatorio'),
  Apellido2: z.string().optional(),

  Tipo_Identificacion: z.enum(['Cedula Nacional', 'DIMEX', 'Pasaporte'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de identificación válido' })
  }),
  
  Identificacion: z.string().min(1, 'El número de identificación es obligatorio'),

  Edad: z.coerce.number()
    .min(18, 'Solo se permite personas mayores de edad')
    .max(120, 'Edad no válida'),
  
  Direccion_Exacta: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),

  Numero_Telefono: z.string().refine(
    (phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone);
      return !!phoneNumber && phoneNumber.isValid();
    },
    {
      message: "Debe ingresar un número de teléfono válido con código de país, ej. +50688088690"
    }
  ),
  
  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),

  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
}).refine((data) => {
  const { Tipo_Identificacion, Identificacion } = data;
  
  if (Tipo_Identificacion === 'Cedula Nacional') {
    return /^\d{9,10}$/.test(Identificacion);
  } else if (Tipo_Identificacion === 'DIMEX') {
    return /^\d{11,12}$/.test(Identificacion);
  } else if (Tipo_Identificacion === 'Pasaporte') {
    return /^[a-zA-Z0-9]{6,20}$/.test(Identificacion);
  }
  return true;
}, (data) => {
  const { Tipo_Identificacion } = data;
  
  if (Tipo_Identificacion === 'Cedula Nacional') {
    return { message: 'La cédula nacional debe tener entre 9 y 10 dígitos', path: ['Identificacion'] };
  } else if (Tipo_Identificacion === 'DIMEX') {
    return { message: 'El DIMEX debe tener entre 11 y 12 dígitos', path: ['Identificacion'] };
  } else if (Tipo_Identificacion === 'Pasaporte') {
    return { message: 'El pasaporte debe tener entre 6 y 20 caracteres alfanuméricos', path: ['Identificacion'] };
  }
  return { message: 'Número de identificación no válido', path: ['Identificacion'] };
})

export type AfiliadoFisico = z.infer<typeof AfiliadoFisicoSchema>