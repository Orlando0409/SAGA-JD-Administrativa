import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { useAfiliadosFisicos } from '../Hook/HookAfiliadoFisico';
import { useAfiliadosJuridicos } from '../Hook/HookAfiliadoJuridico';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

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
        { id: 'afiliado-fisico', label: '👤 Afiliado Físico', icon: '👤' },
        { id: 'afiliado-juridico', label: '🏢 Afiliado Jurídico', icon: '🏢' },
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
            <form.Field name="Nombre">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre"
                            required
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Apellido1">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primer Apellido *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Primer apellido"
                            required
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Apellido2">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Segundo Apellido
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Segundo apellido (opcional)"
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Tipo_Identificacion">
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

            <form.Field name="Identificacion">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Identificación *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese el número según el tipo seleccionado"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Cedula Nacional' && 'Formato: 9-10 dígitos (ej: 123456789)'}
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Dimex' && 'Formato: 11-12 dígitos (ej: 123456789012)'}
                            {field.form.getFieldValue('Tipo_Identificacion') === 'Pasaporte' && 'Formato: 6-20 caracteres alfanuméricos (ej: AB123456)'}
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Numero_Telefono">
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
                            className="w-full"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese número de teléfono"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: +506 8888 8888
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Correo">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ejemplo@email.com"
                            required
                        />
                    </div>
                )}
            </form.Field>

            {(
                <form.Field name="Direccion_Exacta">
                    {(field) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dirección Exacta
                            </label>
                            <textarea
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Dirección exacta de la propiedad"
                                rows={3}
                            />
                        </div>
                    )}
                </form.Field>
            )}

            <form.Field name="Edad">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Edad *
                        </label>
                        <input
                            type="number"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="25"
                            min="0"
                            max="120"
                            required
                        />
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
                                    Archivo cargado
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
                                    Archivo cargado
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
            <form.Field name="Razon_Social">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Razón Social *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Empresa S.A."
                            required
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Cedula_Juridica">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cédula Jurídica *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3-101-123456"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formato: 3-XXX-XXXXXX (ej: 3-101-123456)
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Numero_Telefono">
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
                            className="w-full"
                            inputClassName="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ingrese número de teléfono"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Ejemplo: +506 8888 8888
                        </p>
                    </div>
                )}
            </form.Field>

            <form.Field name="Correo">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ejemplo@email.com"
                            required
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Direccion_Exacta">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección Exacta
                        </label>
                        <textarea
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Dirección exacta de la propiedad"
                            rows={3}
                        />
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
                                    Archivo cargado
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
                                    Archivo cargado
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
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tipoActivo === tab.id
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
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