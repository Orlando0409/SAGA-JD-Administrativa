import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
//funciona 
// Tipo unificado para identificar qué estamos editando
type SolicitudParaEditar = {
    tipo: 'solicitud-fisica' | 'solicitud-juridica';
    datos: SolicitudFisica | SolicitudJuridica;
};





interface EditSolicitudModalProps {
    isOpen: boolean;
    onClose: () => void;
    solicitud: SolicitudParaEditar;
}

// Constantes para límites de caracteres
const NOMBRE_MAX_LENGTH = 50;
const APELLIDO_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 100;
const TELEFONO_MAX_LENGTH = 15;
const CEDULA_MAX_LENGTH = 20;
const DIRECCION_MAX_LENGTH = 200;

const EditSolicitudModal: React.FC<EditSolicitudModalProps> = ({ isOpen, onClose, solicitud }) => {
    const { showSuccess, showError } = useAlerts();
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldCharCounts, setFieldCharCounts] = useState({
        nombre: 0,
        apellido1: 0,
        apellido2: 0,
        razonSocial: 0,
        correo: 0,
        telefono: 0,
        cedula: 0,
        direccion: 0,
    });

    const createInputHandler = (fieldName: string, handleChange: (value: string) => void, maxLength: number) => {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;

            if (value.length <= maxLength) {
                handleChange(value);
                setFieldCharCounts(prev => ({ ...prev, [fieldName]: value.length }));

                if (formErrors[fieldName]) {
                    setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
                }
            }
        };
    };

    const getDefaultValues = () => {
        const { tipo, datos } = solicitud;

        if (tipo === 'solicitud-fisica') {
            const solicitudFisica = datos as SolicitudFisica;
            return {
                Nombre: solicitudFisica.Nombre,
                Apellido1: solicitudFisica.Apellido1,
                Apellido2: solicitudFisica.Apellido2 || '',
                Cedula: solicitudFisica.Identificacion || '', // Priorizar Identificacion
                Numero_Telefono: solicitudFisica.Numero_Telefono,
                Correo: solicitudFisica.Correo,
                Direccion_Exacta: solicitudFisica.Direccion_Exacta || '',
                Edad: solicitudFisica.Edad,
                Tipo_Solicitud: solicitudFisica.Tipo_Solicitud,
            };
        } else { // solicitud-juridica
            const solicitudJuridica = datos as SolicitudJuridica;
            return {
                Razon_Social: solicitudJuridica.Razon_Social,
                Cedula_Juridica: solicitudJuridica.Cedula_Juridica,
                Numero_Telefono: solicitudJuridica.Numero_Telefono,
                Correo: solicitudJuridica.Correo,
                Direccion_Exacta: solicitudJuridica.Direccion_Exacta || '',
                Tipo_Solicitud: solicitudJuridica.Tipo_Solicitud,
            };
        }
    };

    const form = useForm({
        defaultValues: getDefaultValues(),
        onSubmit: async ({ value }) => {
            setFormErrors({});

            try {
                // TODO: Implementar actualizaciones para solicitudes cuando estén disponibles las funciones
                console.log('Actualizar solicitud:', solicitud.tipo, value);
                showSuccess(`${solicitud.tipo === 'solicitud-fisica' ? 'Solicitud física' : 'Solicitud jurídica'} actualizada exitosamente`);
                onClose();
            } catch (error) {
                console.error('Error actualizando:', error);
                showError('Error al actualizar la solicitud');
            }
        },
    });

    const renderCharCounter = (current: number, max: number, hasError: boolean) => {
        const remaining = max - current;
        const isNearLimit = remaining <= 5;

        return (
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                    {hasError ? '' : `Máximo ${max} caracteres`}
                </span>
                <span className={`text-xs font-medium ${isNearLimit ? 'text-orange-600' : 'text-gray-500'
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

    const getModalTitle = () => {
        switch (solicitud.tipo) {
            case 'solicitud-fisica':
                return ' Editar Solicitud Física';
            case 'solicitud-juridica':
                return ' Editar Solicitud Jurídica';
            default:
                return 'Editar Solicitud';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        {/* Tipo de Solicitud */}
                        <form.Field name="Tipo_Solicitud">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Solicitud *
                                    </label>
                                    <select
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value as any)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Afiliacion">Afiliación</option>
                                        <option value="Desconexion">Desconexión</option>
                                        <option value="Cambio de Medidor">Cambio de Medidor</option>
                                        <option value="Asociado">Asociado</option>
                                    </select>
                                </div>
                            )}
                        </form.Field>

                        {/* Campos para solicitudes físicas */}
                        {solicitud.tipo === 'solicitud-fisica' && (
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
                                                onChange={createInputHandler('nombre', field.handleChange, NOMBRE_MAX_LENGTH)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nombre"
                                                maxLength={NOMBRE_MAX_LENGTH}
                                            />
                                            {renderCharCounter(fieldCharCounts.nombre, NOMBRE_MAX_LENGTH, false)}
                                        </div>
                                    )}
                                </form.Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <form.Field name="Apellido1">
                                        {(field) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Primer Apellido *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.state.value}
                                                    onChange={createInputHandler('apellido1', field.handleChange, APELLIDO_MAX_LENGTH)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Primer apellido"
                                                    maxLength={APELLIDO_MAX_LENGTH}
                                                />
                                                {renderCharCounter(fieldCharCounts.apellido1, APELLIDO_MAX_LENGTH, false)}
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
                                                    onChange={createInputHandler('apellido2', field.handleChange, APELLIDO_MAX_LENGTH)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Segundo apellido (opcional)"
                                                    maxLength={APELLIDO_MAX_LENGTH}
                                                />
                                                {renderCharCounter(fieldCharCounts.apellido2, APELLIDO_MAX_LENGTH, false)}
                                            </div>
                                        )}
                                    </form.Field>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <form.Field name="Cedula">
                                        {(field) => (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cédula *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={field.state.value}
                                                    onChange={createInputHandler('cedula', field.handleChange, CEDULA_MAX_LENGTH)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="123456789"
                                                    maxLength={CEDULA_MAX_LENGTH}
                                                />
                                                {renderCharCounter(fieldCharCounts.cedula, CEDULA_MAX_LENGTH, false)}
                                            </div>
                                        )}
                                    </form.Field>

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
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>
                            </>
                        )}

                        {/* Campos para solicitudes jurídicas */}
                        {solicitud.tipo === 'solicitud-juridica' && (
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
                                                onChange={createInputHandler('razonSocial', field.handleChange, NOMBRE_MAX_LENGTH)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Empresa S.A."
                                                maxLength={NOMBRE_MAX_LENGTH}
                                            />
                                            {renderCharCounter(fieldCharCounts.razonSocial, NOMBRE_MAX_LENGTH, false)}
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
                                                onChange={createInputHandler('cedula', field.handleChange, CEDULA_MAX_LENGTH)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="3-101-123456"
                                                maxLength={CEDULA_MAX_LENGTH}
                                            />
                                            {renderCharCounter(fieldCharCounts.cedula, CEDULA_MAX_LENGTH, false)}
                                        </div>
                                    )}
                                </form.Field>
                            </>
                        )}

                        {/* Campos comunes para todos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <form.Field name="Numero_Telefono">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            value={field.state.value}
                                            onChange={createInputHandler('telefono', field.handleChange, TELEFONO_MAX_LENGTH)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="88888888"
                                            maxLength={TELEFONO_MAX_LENGTH}
                                        />
                                        {renderCharCounter(fieldCharCounts.telefono, TELEFONO_MAX_LENGTH, false)}
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
                                            onChange={createInputHandler('correo', field.handleChange, EMAIL_MAX_LENGTH)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="ejemplo@email.com"
                                            maxLength={EMAIL_MAX_LENGTH}
                                        />
                                        {renderCharCounter(fieldCharCounts.correo, EMAIL_MAX_LENGTH, false)}
                                    </div>
                                )}
                            </form.Field>
                        </div>

                        <form.Field name="Direccion_Exacta">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección Exacta
                                    </label>
                                    <textarea
                                        value={field.state.value}
                                        onChange={createInputHandler('direccion', field.handleChange, DIRECCION_MAX_LENGTH)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Dirección exacta de la propiedad"
                                        rows={3}
                                        maxLength={DIRECCION_MAX_LENGTH}
                                    />
                                    {renderCharCounter(fieldCharCounts.direccion, DIRECCION_MAX_LENGTH, false)}
                                </div>
                            )}
                        </form.Field>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Actualizar Solicitud
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSolicitudModal;