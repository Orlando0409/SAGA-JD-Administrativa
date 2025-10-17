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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Nombre"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primer Apellido *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Primer apellido"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Segundo Apellido
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Segundo apellido (opcional)"
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Identificación *
                        </label>
                        <select
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'Cedula Nacional' | 'Dimex' | 'Pasaporte')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Identificación *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Ingrese el número según el tipo seleccionado"
                            required
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
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
                            className={`w-full ${field.state.meta.errors.length > 0 ? 'border-red-500' : ''
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="ejemplo@email.com"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección Exacta *
                        </label>
                        <textarea
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Dirección exacta de la propiedad"
                            rows={3}
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Edad *
                        </label>
                        <input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Razón Social *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Empresa S.A."
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cédula Jurídica *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="3-101-123456"
                            required
                        />
                        {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs mt-1">
                                {String(field.state.meta.errors[0])}
                            </p>
                        )}
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
                            className={`w-full ${field.state.meta.errors.length > 0 ? 'border-red-500' : ''
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="ejemplo@email.com"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección Exacta *
                        </label>
                        <textarea
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${field.state.meta.errors.length > 0
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                                }`}
                            placeholder="Dirección exacta de la propiedad"
                            rows={3}
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

    const renderFormulario = () => {
        if (tipoActivo === 'afiliado-fisico') {
            return renderFormularioFisico();
        } else {
            return renderFormularioJuridico();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
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
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {renderFormulario()}

                        {/* Botones de acción */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creando...
                                    </>
                                ) : (
                                    `Crear ${tipoActivo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;