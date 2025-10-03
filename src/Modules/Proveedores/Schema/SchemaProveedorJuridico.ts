import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Expresiones regulares para validaciones basadas en el backend
const NOMBRE_NO_SOLO_ESPACIOS = /\S/; // No puede contener solo espacios
const RAZON_SOCIAL_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/; // Solo letras y espacios, sin números
// Validación específica para cédula jurídica según backend: 10 dígitos, empezar con 2, 3, 4 o 5
const CEDULA_JURIDICA_REGEX = /^[2345]\d{9}$/; // Formato de cédula jurídica costarricense (10 dígitos)

// Validación de teléfono (formato internacional usando libphonenumber-js)
const validatePhoneNumber = (value: string): boolean => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
};

// Schema para crear proveedores jurídicos (basado en CreateProveedorJuridicoDto del backend)
export const CreateProveedorJuridicoSchema = z.object({
  Nombre_Proveedor: z.string({ message: "El nombre debe ser un texto" })
    .min(1, { message: 'El nombre no puede estar vacío' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(40, { message: 'El nombre no debe superar los 40 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'El nombre no puede contener solo espacios'
    }),

  Razon_Social: z.string({ message: "La razón social debe ser un texto" })
    .min(1, { message: 'La razón social no puede estar vacía' })
    .max(20, { message: 'La razón social no debe superar los 20 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'La razon social no puede contener solo espacios'
    })
    .refine((val) => RAZON_SOCIAL_REGEX.test(val), {
      message: 'La razón social solo puede contener letras y espacios, sin números'
    }),

  Cedula_Juridica: z.string({ message: "La cédula jurídica debe ser texto" })
    .min(1, { message: 'La cédula jurídica es obligatoria' })
    .max(10, { message: 'La cédula jurídica debe tener exactamente 10 dígitos' })
    .transform((val) => val.replace(/-/g, '').trim()) // Normalizar removiendo guiones
    .refine((val) => val.length === 10, {
      message: 'La cédula jurídica debe tener exactamente 10 dígitos'
    })
    .refine((val) => /^\d+$/.test(val), {
      message: 'La cédula jurídica debe contener solo dígitos'
    })
    .refine((val) => CEDULA_JURIDICA_REGEX.test(val), {
      message: 'La cédula jurídica debe comenzar con 2, 3, 4 o 5 y tener exactamente 10 dígitos'
    }),

  Telefono_Proveedor: z.string({ message: 'El número de teléfono debe ser un string' })
    .min(1, { message: 'El número de teléfono no puede estar vacío' })
    .transform((val) => val.trim())
    .refine((val) => validatePhoneNumber(val), {
      message: 'Número de teléfono inválido'
    }),

  Id_Estado_Proveedor: z.number({ message: "El estado debe ser un número" })
    .positive({ message: "El estado debe ser mayor a 0" })
    .int({ message: "El estado debe ser un número entero" })
});

// Schema para editar proveedores jurídicos (solo campos permitidos)
export const EditProveedorJuridicoSchema = z.object({
  Nombre_Proveedor: z.string({ message: "El nombre debe ser un texto" })
    .min(1, { message: 'El nombre no puede estar vacío' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(40, { message: 'El nombre no debe superar los 40 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'El nombre no puede contener solo espacios'
    }),

  Razon_Social: z.string({ message: "La razón social debe ser un texto" })
    .min(1, { message: 'La razón social no puede estar vacía' })
    .max(20, { message: 'La razón social no debe superar los 20 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'La razon social no puede contener solo espacios'
    })
    .refine((val) => RAZON_SOCIAL_REGEX.test(val), {
      message: 'La razón social solo puede contener letras y espacios, sin números'
    }),

  Telefono_Proveedor: z.string({ message: 'El número de teléfono debe ser un string' })
    .min(1, { message: 'El número de teléfono no puede estar vacío' })
    .transform((val) => val.trim())
    .refine((val) => validatePhoneNumber(val), {
      message: 'Número de teléfono inválido'
    })
});

// Tipos TypeScript inferidos de los schemas jurídicos
export type CreateProveedorJuridicoSchemaData = z.infer<typeof CreateProveedorJuridicoSchema>;
export type EditProveedorJuridicoSchemaData = z.infer<typeof EditProveedorJuridicoSchema>;

// Constantes para límites de caracteres específicos de proveedores jurídicos (basado en backend)
export const JURIDICO_VALIDATION_LIMITS = {
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 40, // Actualizado a 40 caracteres
  RAZON_SOCIAL_MAX_LENGTH: 20, // Actualizado a 20 caracteres
  CEDULA_JURIDICA_LENGTH: 10, // Exactamente 10 dígitos
  CEDULA_JURIDICA_MAX_LENGTH: 10, // Para el input maxLength
  TELEFONO_MAX_LENGTH: 20,
} as const;

// Estados de proveedor jurídico (para usar en el frontend)
export const ESTADOS_PROVEEDOR_JURIDICO_OPTIONS = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
] as const;

// Función para formatear cédula jurídica para visualización
export const formatCedulaJuridica = (cedula: string): string => {
  if (!cedula) return '';
  
  // Remover cualquier formato existente (espacios, guiones)
  const cleanCedula = cedula.replace(/[\s\-]/g, '');
  
  // Validar que tenga exactamente 10 dígitos
  if (cleanCedula.length !== 10 || !/^\d{10}$/.test(cleanCedula)) {
    return cedula; // Retornar original si no es válido
  }
  
  // Aplicar formato 0-000-000000 (1-3-6)
  return `${cleanCedula.slice(0, 1)}-${cleanCedula.slice(1, 4)}-${cleanCedula.slice(4, 10)}`;
};
