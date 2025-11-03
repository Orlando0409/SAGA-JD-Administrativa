import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { useAfiliadosFisicos } from '../Hook/HookAfiliadoFisico';
import { useAfiliadosJuridicos } from '../Hook/HookAfiliadoJuridico';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { User, Building2 } from 'lucide-react';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TipoFormulario = 'afiliado-fisico' | 'afiliado-juridico';



const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
    const [tipoActivo, setTipoActivo] = useState<TipoFormulario>('afiliado-fisico');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [escrituraFile, setEscrituraFile] = useState<File | null>(null);
    const [planosFile, setPlanosFile] = useState<File | null>(null);
    const { showSuccess, showError } = useAlerts();
    const { createAfiliadoFisico } = useAfiliadosFisicos();
    const { createAfiliadoJuridico } = useAfiliadosJuridicos();
    
    // Estado para contadores de caracteres
    const [fieldCharCounts, setFieldCharCounts] = useState({
        Nombre: 0,
        Apellido1: 0,
        Apellido2: 0,
        Identificacion: 0,
        Numero_Telefono: 0,
        Correo: 0,
        Direccion_Exacta: 0,
        Razon_Social: 0,
        Cedula_Juridica: 0
    });

    // Estado para errores de validación personalizados
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const tabs = [
        { id: 'afiliado-fisico', label: 'Afiliado Físico', icon: User },
        { id: 'afiliado-juridico', label: 'Afiliado Jurídico', icon: Building2 },
    ] as const;

    const getDefaultValues = () => {
        if (tipoActivo === 'afiliado-fisico') {
            return {
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Tipo_Identificacion: 'Cedula Nacional' as 'Cedula Nacional' | 'Dimex' | 'Pasaporte',
                Identificacion: '',
                Numero_Telefono: '',
                Correo: '',
                Direccion_Exacta: '',
                Edad: 0,
                Escritura_Terreno: '',
                Planos_Terreno: '',
            };
        } else {
            return {
                Razon_Social: '',
                Cedula_Juridica: '',
                Numero_Telefono: '',
                Correo: '',
                Direccion_Exacta: '',
                Escritura_Terreno: '',
                Planos_Terreno: '',
            };
        }
    };

    // Validaciones individuales
    const nombreSchema = z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede tener más de 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios');

    const apellidoSchema = z.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede tener más de 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios');

    const apellido2Schema = z.string()
        .max(50, 'El segundo apellido no puede tener más de 50 caracteres')
        .optional();

    const emailSchema = z.string()
        .min(1, 'El correo no puede estar vacío')
        .max(100, 'El correo no puede tener más de 100 caracteres')
        .email('El correo electrónico debe tener un formato válido')
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'El formato del correo electrónico no es válido');

    const phoneSchema = z.string()
        .min(1, 'El número de teléfono no puede estar vacío')
        .refine(
            (phone) => {
                const phoneNumber = parsePhoneNumberFromString(phone);
                return !!phoneNumber && phoneNumber.isValid();
            },
            { message: "Número de teléfono inválido" }
        );

    const direccionSchema = z.string()
        .min(10, 'La dirección debe tener al menos 10 caracteres')
        .max(255, 'La dirección no puede tener más de 255 caracteres')
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#');

    const edadSchema = z.coerce.number()
        .min(18, 'La edad mínima es 18 años')
        .max(120, 'La edad máxima es 120 años');

    const tipoIdSchema = z.enum(['Cedula Nacional', 'DIMEX', 'Pasaporte']);

    const identificacionSchema = z.string().min(1, 'La identificación no puede estar vacía');

    const razonSocialSchema = z.string()
        .min(2, 'La razón social debe tener al menos 2 caracteres')
        .max(100, 'La razón social no puede tener más de 100 caracteres')
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,&()-]+$/, 'La razón social solo puede contener letras, números, espacios y los caracteres .,&()-');

    const cedulaJuridicaSchema = z.string()
        .min(1, 'La cédula jurídica no puede estar vacía')
        .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX');

    // Función para crear el handler de input con validación
    const createInputHandler = (fieldName: string, handleChange: (value: string) => void, maxLength: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            
            if (value.length <= maxLength) {
                handleChange(value);
                setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));
                
                // Limpiar error cuando el usuario escribe
                if (validationErrors[fieldName]) {
                    setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
                }
            }
        };
    };

    // Función para crear handler de textarea
    const createTextareaHandler = (fieldName: string, handleChange: (value: string) => void, maxLength: number) => {
        return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            
            if (value.length <= maxLength) {
                handleChange(value);
                setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));
                
                // Limpiar error cuando el usuario escribe
                if (validationErrors[fieldName]) {
                    setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
                }
            }
        };
    };

    // Función para renderizar contador de caracteres
    const renderCharCounter = (current: number, max: number, hasError: boolean) => {
        const remaining = max - current;
        const isNearLimit = remaining <= 5;
        
        return (
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                    {hasError ? '' : `Máximo ${max} caracteres`}
                </span>
                <span className={`text-xs font-medium ${
                    isNearLimit ? 'text-orange-600' : 'text-gray-500'
                }`}>
                    {current}/{max}
                    {isNearLimit && current < max && (
                        <span className="ml-1 text-orange-600">
                            ({remaining} restantes)
                        </span>
                    )}
                </span>
            </div>
        );
    };

    // Función para mostrar errores (de validación del form o errores personalizados)
    const renderError = (fieldName: string, fieldErrors: any[]) => {
        const customError = validationErrors[fieldName];
        const formError = fieldErrors.length > 0 ? String(fieldErrors[0]) : null;
        const errorMessage = customError || formError;

        if (errorMessage) {
            return <p className="text-red-500 text-xs mt-1">{errorMessage}</p>;
        }
        return null;
    };

    const form = useForm({
        defaultValues: getDefaultValues(),
        onSubmit: async ({ value }) => {
            if (isSubmitting) return;

            try {
                setIsSubmitting(true);

                // Crear FormData para enviar archivos
                const formData = new FormData();

                if (tipoActivo === 'afiliado-fisico') {
                    // Agregar campos de afiliado físico
                    formData.append('Nombre', value.Nombre || '');
                    formData.append('Apellido1', value.Apellido1 || '');
                    formData.append('Apellido2', value.Apellido2 || '');
                    formData.append('Tipo_Identificacion', value.Tipo_Identificacion || 'Cedula Nacional');
                    formData.append('Identificacion', value.Identificacion || '');
                    formData.append('Numero_Telefono', value.Numero_Telefono || '');
                    formData.append('Correo', value.Correo || '');
                    formData.append('Direccion_Exacta', value.Direccion_Exacta || '');
                    formData.append('Edad', value.Edad?.toString() || '0');

                    // Agregar archivos si están disponibles
                    if (escrituraFile) formData.append('Escritura_Terreno', escrituraFile);
                    if (planosFile) formData.append('Planos_Terreno', planosFile);

                    await createAfiliadoFisico(formData);
                    showSuccess('Afiliado físico creado exitosamente');
                } else {
                    // Agregar campos de afiliado jurídico
                    formData.append('Razon_Social', value.Razon_Social || '');
                    formData.append('Cedula_Juridica', value.Cedula_Juridica || '');
                    formData.append('Numero_Telefono', value.Numero_Telefono || '');
                    formData.append('Correo', value.Correo || '');
                    formData.append('Direccion_Exacta', value.Direccion_Exacta || '');

                    // Agregar archivos si están disponibles
                    if (escrituraFile) formData.append('Escritura_Terreno', escrituraFile);
                    if (planosFile) formData.append('Planos_Terreno', planosFile);

                    await createAfiliadoJuridico(formData);
                    showSuccess('Afiliado jurídico creado exitosamente');
                }

                // Cerrar modal y resetear formulario
                onClose();
                form.reset();
                setEscrituraFile(null);
                setPlanosFile(null);

            } catch (error) {
                console.error('Error creando registro:', error);
                showError('Error al crear el registro. Por favor intente nuevamente.');
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // Mover la verificación de isOpen DESPUÉS de todos los hooks
    if (!isOpen) return null;

    const renderFormularioFisico = () => (
        <>
            <form.Field
                name="Nombre"
                validators={{
                    onChange: ({ value }) => {
                        const result = nombreSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Nombre" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                        </label>
                        <input
                            id="Nombre"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Nombre', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Nombre)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Nombre"
                            maxLength={50}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Nombre,
                            50,
                            field.state.meta.errors.length > 0 || !!validationErrors.Nombre
                        )}

                        {renderError('Nombre', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Apellido1"
                validators={{
                    onChange: ({ value }) => {
                        const result = apellidoSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Apellido1" className="block text-sm font-medium text-gray-700 mb-1">
                            Primer Apellido *
                        </label>
                        <input
                            id="Apellido1"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Apellido1', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Apellido1)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Primer apellido"
                            maxLength={50}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Apellido1,
                            50,
                            field.state.meta.errors.length > 0 || !!validationErrors.Apellido1
                        )}

                        {renderError('Apellido1', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Apellido2"
                validators={{
                    onChange: ({ value }) => {
                        const result = apellido2Schema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Apellido2" className="block text-sm font-medium text-gray-700 mb-1">
                            Segundo Apellido
                        </label>
                        <input
                            id="Apellido2"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Apellido2', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Apellido2)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Segundo apellido (opcional)"
                            maxLength={50}
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Apellido2,
                            50,
                            field.state.meta.errors.length > 0 || !!validationErrors.Apellido2
                        )}

                        {renderError('Apellido2', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Tipo_Identificacion"
                validators={{
                    onChange: ({ value }) => {
                        const result = tipoIdSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Tipo_Identificacion" className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Identificación *
                        </label>
                        <select
                            id="Tipo_Identificacion"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'Cedula Nacional' | 'Dimex' | 'Pasaporte')}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                field.state.meta.errors.length > 0
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            required
                        >
                            <option value="Cedula Nacional">Cédula Nacional</option>
                            <option value="Dimex">DIMEX</option>
                            <option value="Pasaporte">Pasaporte</option>
                        </select>
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Identificacion"
                validators={{
                    onChange: ({ value }) => {
                        const result = identificacionSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Identificacion" className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Identificación *
                        </label>
                        <input
                            id="Identificacion"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Identificacion', field.handleChange, 20)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Identificacion)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Ingrese el número según el tipo seleccionado"
                            maxLength={20}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Identificacion,
                            20,
                            field.state.meta.errors.length > 0 || !!validationErrors.Identificacion
                        )}

                        {renderError('Identificacion', field.state.meta.errors)}
                        
                        <p className="text-xs text-gray-500 mt-1">
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Cedula Nacional' && 'Formato: 9-10 dígitos (ej: 123456789)'}
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Dimex' && 'Formato: 11-12 dígitos (ej: 123456789012)'}
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Pasaporte' && 'Formato: 6-20 caracteres alfanuméricos (ej: AB123456)'}
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Numero_Telefono"
                validators={{
                    onChange: ({ value }) => {
                        const result = phoneSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                        </label>
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="CR"
                            value={field.state.value as any}
                            onChange={(value) => field.handleChange(value || '')}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  ${field.state.meta.errors.length > 0 ? 'border-red-500' : ''
                                }`}
                            inputClassName={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Ingrese número de teléfono"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: +506 8888 8888
                        </p>
                    </div>
                )}
            </form.Field>
            <form.Field
                name="Correo"
                validators={{
                    onChange: ({ value }) => {
                        const result = emailSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Correo" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            id="Correo"
                            type="email"
                            value={field.state.value}
                            onChange={createInputHandler('Correo', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Correo)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="ejemplo@email.com"
                            maxLength={100}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Correo,
                            100,
                            field.state.meta.errors.length > 0 || !!validationErrors.Correo
                        )}

                        {renderError('Correo', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Direccion_Exacta"
                validators={{
                    onChange: ({ value }) => {
                        const result = direccionSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Direccion_Exacta" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección Exacta *
                        </label>
                        <textarea
                            id="Direccion_Exacta"
                            value={field.state.value}
                            onChange={createTextareaHandler('Direccion_Exacta', field.handleChange, 255)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Direccion_Exacta)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Dirección exacta de la propiedad"
                            rows={3}
                            maxLength={255}
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Direccion_Exacta,
                            255,
                            field.state.meta.errors.length > 0 || !!validationErrors.Direccion_Exacta
                        )}

                        {renderError('Direccion_Exacta', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Edad"
                validators={{
                    onChange: ({ value }) => {
                        const result = edadSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Edad" className="block text-sm font-medium text-gray-700 mb-1">
                            Edad *
                        </label>
                        <input
                            id="Edad"
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                field.state.meta.errors.length > 0
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="25"
                            min="18"
                            max="120"
                            required
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
                    </div>
                )}
            </form.Field>

            <form.Field name="Escritura_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Escritura del Terreno
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setEscrituraFile(file);
                                        field.handleChange(file.name);
                                    } else {
                                        setEscrituraFile(null);
                                        field.handleChange('');
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700">
                                    {field.state.value || 'Seleccionar archivo...'}
                                </span>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                    Subir Archivo
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPlanosFile(file);
                                        field.handleChange(file.name);
                                    } else {
                                        setPlanosFile(null);
                                        field.handleChange('');
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700">
                                    {field.state.value || 'Seleccionar archivo...'}
                                </span>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                    Subir Archivo
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>
                )}
            </form.Field>

        </>
    );

    const renderFormularioJuridico = () => (
        <>
            <form.Field
                name="Razon_Social"
                validators={{
                    onChange: ({ value }) => {
                        const result = razonSocialSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Razon_Social" className="block text-sm font-medium text-gray-700 mb-1">
                            Razón Social *
                        </label>
                        <input
                            id="Razon_Social"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Razon_Social', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Razon_Social)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Empresa S.A."
                            maxLength={100}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Razon_Social,
                            100,
                            field.state.meta.errors.length > 0 || !!validationErrors.Razon_Social
                        )}

                        {renderError('Razon_Social', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Cedula_Juridica"
                validators={{
                    onChange: ({ value }) => {
                        const result = cedulaJuridicaSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Cedula_Juridica" className="block text-sm font-medium text-gray-700 mb-1">
                            Cédula Jurídica *
                        </label>
                        <input
                            id="Cedula_Juridica"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Cedula_Juridica', field.handleChange, 15)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Cedula_Juridica)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="3-101-123456"
                            maxLength={15}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Cedula_Juridica,
                            15,
                            field.state.meta.errors.length > 0 || !!validationErrors.Cedula_Juridica
                        )}

                        {renderError('Cedula_Juridica', field.state.meta.errors)}
                        
                        <p className="text-xs text-gray-500 mt-1">
                            Formato: 3-XXX-XXXXXX (ej: 3-101-123456)
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Numero_Telefono"
                validators={{
                    onChange: ({ value }) => {
                        const result = phoneSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                        </label>
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="CR"
                            value={field.state.value as any}
                            onChange={(value) => field.handleChange(value || '')}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500  ${field.state.meta.errors.length > 0 ? 'border-red-500' : ''
                                }`}
                            inputClassName={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Ingrese número de teléfono"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: +506 8888 8888
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Correo"
                validators={{
                    onChange: ({ value }) => {
                        const result = emailSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Correo_Juridico" className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            id="Correo_Juridico"
                            type="email"
                            value={field.state.value}
                            onChange={createInputHandler('Correo', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Correo)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="ejemplo@email.com"
                            maxLength={100}
                            required
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Correo,
                            100,
                            field.state.meta.errors.length > 0 || !!validationErrors.Correo
                        )}

                        {renderError('Correo', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field
                name="Direccion_Exacta"
                validators={{
                    onChange: ({ value }) => {
                        const result = direccionSchema.safeParse(value);
                        return result.success ? undefined : result.error.errors[0].message;
                    },
                }}
            >
                {(field) => (
                    <div>
                        <label htmlFor="Direccion_Exacta_Juridico" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección Exacta *
                        </label>
                        <textarea
                            id="Direccion_Exacta_Juridico"
                            value={field.state.value}
                            onChange={createTextareaHandler('Direccion_Exacta', field.handleChange, 255)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                                (field.state.meta.errors.length > 0 || validationErrors.Direccion_Exacta)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder="Dirección exacta de la propiedad"
                            rows={3}
                            maxLength={255}
                        />
                        
                        {renderCharCounter(
                            fieldCharCounts.Direccion_Exacta,
                            255,
                            field.state.meta.errors.length > 0 || !!validationErrors.Direccion_Exacta
                        )}

                        {renderError('Direccion_Exacta', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            <form.Field name="Escritura_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Escritura del Terreno
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setEscrituraFile(file);
                                        field.handleChange(file.name);
                                    } else {
                                        setEscrituraFile(null);
                                        field.handleChange('');
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700">
                                    {field.state.value || 'Seleccionar archivo...'}
                                </span>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                    Subir Archivo
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPlanosFile(file);
                                        field.handleChange(file.name);
                                    } else {
                                        setPlanosFile(null);
                                        field.handleChange('');
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-gray-700">
                                    {field.state.value || 'Seleccionar archivo...'}
                                </span>
                                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                                    Subir Archivo
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>
                )}
            </form.Field>
        </>
    );

    const renderFormulario = () => {
        if (tipoActivo === 'afiliado-fisico') {
            return renderFormularioFisico();
        } else {
            return renderFormularioJuridico();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-10 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Nueva Solicitud</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">✕</div>
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setTipoActivo(tab.id);
                                    // Reiniciar el formulario con los valores por defecto del nuevo tipo
                                    form.reset();
                                    // Limpiar archivos
                                    setEscrituraFile(null);
                                    setPlanosFile(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tipoActivo === tab.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                    <form
                        id="afiliado-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {renderFormulario()}
                    </form>
                </div>

                {/* Botones de acción */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
                    <button
                        type="submit"
                        form="afiliado-form"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creando...</span>
                            </>
                        ) : (
                            `Crear ${tipoActivo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
    
            </div>
        </div>
    );
};

export default CreateModal;