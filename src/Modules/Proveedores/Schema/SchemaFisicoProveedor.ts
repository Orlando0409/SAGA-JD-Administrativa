import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js';

// Expresiones regulares para validaciones basadas en el backend
const NOMBRE_NO_SOLO_ESPACIOS = /\S/; // No puede contener solo espacios (Matches(/\S/))

// Validaciones de identificación más específicas según backend
const CEDULA_REGEX = /^[1-7]\d{8}$/; // 9 dígitos, debe empezar con 1-7
const DIMEX_REGEX = /^[1-9]\d{11}$/; // 12 dígitos, no puede empezar con 0
const PASAPORTE_REGEX = /^(?=.*[A-Z])(?![A-Z]{4,})[A-Z0-9]{6,12}$/; // 6-12 caracteres, al menos 1 letra, máximo 3 letras

// Funciones de normalización para identificaciones (quitar espacios y guiones)
function normalizeIdentificacion(value: string): string {
    return value.replace(/[\s\-]/g, '').toUpperCase();
}

// Validación de teléfono (formato internacional usando libphonenumber-js)
const validatePhoneNumber = (value: string): boolean => {
  try {
    return isValidPhoneNumber(value);
  } catch {
    return false;
  }
};

// Función para formatear números de teléfono para visualización
export const formatPhoneNumberDisplay = (phoneNumber: string): string => {
  try {
    if (!phoneNumber) return '';
    
    // Intentar parsear el número completo
    const parsed = parsePhoneNumber(phoneNumber);
    if (parsed && parsed.isValid()) {
      // Retornar en formato internacional con espacios
      return parsed.formatInternational();
    }
    
    // Si no es válido como número completo, formatear como incompleto
    return formatIncompletePhoneNumber(phoneNumber);
  } catch {
    return phoneNumber; // Retornar original si hay error
  }
};

// Función para formatear teléfono en tiempo real mientras se escribe
export const formatPhoneNumberInput = (value: string): string => {
  try {
    if (!value) return '';
    
    // Usar formatIncompletePhoneNumber para formateo en tiempo real
    return formatIncompletePhoneNumber(value);
  } catch {
    return value;
  }
};

// Enum para tipos de identificación (valores que espera el backend)
const TipoIdentificacionEnum = z.enum(['Cedula Nacional', 'Dimex', 'Pasaporte'], {
  errorMap: () => ({ message: 'Para proveedores físicos solo se permiten: Cedula Nacional, Dimex, Pasaporte' })
});

// Schema basado en CreateProveedorFisicoDto del backend
export const CreateProveedorSchema = z.object({
  Nombre_Proveedor: z.string({ message: "El nombre debe ser un texto" })
    .min(1, { message: 'El nombre no puede estar vacío' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(40, { message: 'El nombre no debe superar los 40 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'El nombre no puede contener solo espacios'
    }),

  Tipo_Identificacion: TipoIdentificacionEnum,

  Identificacion: z.string({ message: 'La identificación debe ser un string' })
    .min(1, { message: 'La identificación no puede estar vacía' })
    .transform((val) => normalizeIdentificacion(val)),

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

// Schema simplificado para edición (solo campos permitidos)
export const EditProveedorSchema = z.object({
  Nombre_Proveedor: z.string({ message: "El nombre debe ser un texto" })
    .min(1, { message: 'El nombre no puede estar vacío' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(40, { message: 'El nombre no debe superar los 40 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'El nombre no puede contener solo espacios'
    }),

  Telefono_Proveedor: z.string({ message: 'El número de teléfono debe ser un string' })
    .min(1, { message: 'El número de teléfono no puede estar vacío' })
    .transform((val) => val.trim())
    .refine((val) => validatePhoneNumber(val), {
      message: 'Número de teléfono inválido'
    })
});

export type EditProveedorSchemaData = z.infer<typeof EditProveedorSchema>;

// Validación refinada completa para identificación específica por tipo
export const CreateProveedorSchemaWithIdentificacionValidation = CreateProveedorSchema.superRefine((data, ctx) => {
  const { Identificacion, Tipo_Identificacion } = data;

  switch (Tipo_Identificacion) {
    case 'Cedula Nacional':
      if (!CEDULA_REGEX.test(Identificacion)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La cédula nacional debe tener 9 dígitos numéricos y debe comenzar con un número del 1 al 7',
          path: ['Identificacion'],
        });
      }
      break;
    case 'Dimex':
      if (!DIMEX_REGEX.test(Identificacion)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El DIMEX debe tener 12 dígitos numéricos y no puede comenzar con 0',
          path: ['Identificacion'],
        });
      }
      break;
    case 'Pasaporte':
      if (!PASAPORTE_REGEX.test(Identificacion)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos en mayúsculas, con al menos 1 letra y máximo 3 letras',
          path: ['Identificacion'],
        });
      }
      break;
  }
});

export type CreateProveedorSchemaData = z.infer<typeof CreateProveedorSchema>;

// Constantes para límites de caracteres (basado en el backend CreateProveedorFisicoDto)
export const VALIDATION_LIMITS = {
  NOMBRE_MIN_LENGTH: 2, // MinLength(2)
  NOMBRE_MAX_LENGTH: 40, // Actualizado a 40 caracteres
  TELEFONO_MAX_LENGTH: 20,
  IDENTIFICACION_MAX_LENGTH: 20,
  CEDULA_LENGTH: 9,
  DIMEX_LENGTH: 12,
  PASAPORTE_MIN_LENGTH: 6,
  PASAPORTE_MAX_LENGTH: 12,
} as const;

// Límites específicos por tipo de identificación
export const IDENTIFICACION_LIMITS_BY_TYPE = {
  'Cedula Nacional': VALIDATION_LIMITS.CEDULA_LENGTH,
  'Dimex': VALIDATION_LIMITS.DIMEX_LENGTH,
  'Pasaporte': VALIDATION_LIMITS.PASAPORTE_MAX_LENGTH,
  default: VALIDATION_LIMITS.IDENTIFICACION_MAX_LENGTH
} as const;

// Formatos de placeholder para cada tipo de identificación
export const IDENTIFICACION_PLACEHOLDERS = {
  'Cedula Nacional': '123456789 (1-7)',
  'Dimex': '123456789012', 
  'Pasaporte': 'ABC123456',
  default: 'Seleccione un tipo primero'
} as const;

// Tipos de identificación disponibles (para usar en el frontend)
export const TIPOS_IDENTIFICACION_OPTIONS = [
  { value: 'Cedula Nacional' as const, label: 'Cédula Nacional' },
  { value: 'Pasaporte' as const, label: 'Pasaporte' },
  { value: 'Dimex' as const, label: 'DIMEX' },
] as const;

// Estados de proveedor (para usar en el frontend)
export const ESTADOS_PROVEEDOR_OPTIONS = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
] as const;


