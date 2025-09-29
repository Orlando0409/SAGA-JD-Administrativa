import { z } from 'zod';

// Expresiones regulares para validaciones
const NOMBRE_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/; // Solo letras, espacios y caracteres latinos (sin números)
const NOMBRE_NO_SOLO_ESPACIOS = /\S/; // No puede contener solo espacios

// Validaciones de identificación más específicas según backend
const CEDULA_REGEX = /^[1-9]\d{8}$/; // 9 dígitos, no puede empezar con 0
const DIMEX_REGEX = /^[1-9]\d{11}$/; // 12 dígitos, no puede empezar con 0
const PASAPORTE_REGEX = /^(?=.*[A-Z])(?![A-Z]{4,})[A-Z0-9]{6,12}$/; // 6-12 caracteres, al menos 1 letra, máximo 3 letras

// Funciones de normalización para identificaciones (quitar espacios y guiones)
function normalizeIdentificacion(value: string): string {
    return value.replace(/[\s\-]/g, '').toUpperCase();
}

// Validación de teléfono (acepta varios formatos)
const TELEFONO_REGEX = /^(\+?\d{1,3}[\s\-]?)?\d{4}[\s\-]?\d{4}$/;

// Enum para tipos de identificación
const TipoIdentificacionEnum = z.enum(['Cedula', 'Dimex', 'Pasaporte'], {
  errorMap: () => ({ message: 'Para proveedores físicos solo se permiten: Cedula Nacional, Dimex, Pasaporte' })
});

export const CreateProveedorSchema = z.object({
  Nombre_Proveedor: z.string()
    .min(1, { message: 'El nombre no puede estar vacío' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    .max(50, { message: 'El nombre no debe superar los 50 caracteres' })
    .transform((val) => val.trim())
    .refine((val) => NOMBRE_NO_SOLO_ESPACIOS.test(val), {
      message: 'El nombre no puede contener solo espacios'
    })
    .refine((val) => NOMBRE_REGEX.test(val), {
      message: 'El nombre solo puede contener letras y espacios'
    }),

  Tipo_Identificacion: TipoIdentificacionEnum,

  Identificacion: z.string()
    .min(1, { message: 'La identificación no puede estar vacía' })
    .transform((val) => normalizeIdentificacion(val)),

  Telefono_Proveedor: z.string()
    .min(1, { message: 'El número de teléfono no puede estar vacío' })
    .transform((val) => val.trim())
    .refine((val) => TELEFONO_REGEX.test(val), {
      message: 'Formato de teléfono inválido. Ej: 8888-7777 o +506-8888-7777'
    }),

  Id_Estado_Proveedor: z.number()
    .positive({ message: 'El estado debe ser mayor a 0' })
    .int({ message: 'El estado debe ser un número entero' })
});

// Validación refinada completa para identificación específica por tipo
export const CreateProveedorSchemaWithIdentificacionValidation = CreateProveedorSchema.superRefine((data, ctx) => {
  const { Identificacion, Tipo_Identificacion } = data;

  switch (Tipo_Identificacion) {
    case 'Cedula':
      if (!CEDULA_REGEX.test(Identificacion)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La cédula nacional debe tener 9 dígitos numéricos y no puede comenzar con 0',
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

// Constantes para límites de caracteres (para usar en el frontend)
export const VALIDATION_LIMITS = {
  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 50,
  TELEFONO_MAX_LENGTH: 20,
  IDENTIFICACION_MAX_LENGTH: 20,
  CEDULA_LENGTH: 9,
  DIMEX_LENGTH: 12,
  PASAPORTE_MIN_LENGTH: 6,
  PASAPORTE_MAX_LENGTH: 12,
} as const;

// Límites específicos por tipo de identificación
export const IDENTIFICACION_LIMITS_BY_TYPE = {
  Cedula: VALIDATION_LIMITS.CEDULA_LENGTH,
  Dimex: VALIDATION_LIMITS.DIMEX_LENGTH,
  Pasaporte: VALIDATION_LIMITS.PASAPORTE_MAX_LENGTH,
  default: VALIDATION_LIMITS.IDENTIFICACION_MAX_LENGTH
} as const;

// Formatos de placeholder para cada tipo de identificación
export const IDENTIFICACION_PLACEHOLDERS = {
  Cedula: '123456789',
  Dimex: '123456789012', 
  Pasaporte: 'ABC123456',
  default: 'Seleccione un tipo primero'
} as const;

// Tipos de identificación disponibles (para usar en el frontend)
export const TIPOS_IDENTIFICACION_OPTIONS = [
  { value: 'Cedula' as const, label: 'Cédula Nacional' },
  { value: 'Pasaporte' as const, label: 'Pasaporte' },
  { value: 'Dimex' as const, label: 'DIMEX' },
] as const;

// Estados de proveedor (para usar en el frontend)
export const ESTADOS_PROVEEDOR_OPTIONS = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
] as const;
