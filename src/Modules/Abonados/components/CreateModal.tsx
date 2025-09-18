import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TipoFormulario = 'afiliado-fisico' | 'afiliado-juridico';

const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
    const [tipoActivo, setTipoActivo] = useState<TipoFormulario>('afiliado-fisico');
    const { showSuccess, showError } = useAlerts();

    if (!isOpen) return null;

    const tabs = [
        { id: 'afiliado-fisico', label: ' Afiliado Físico', icon: '�' },
        { id: 'afiliado-juridico', label: '🏢 Afiliado Jurídico', icon: '🏢' },
    ] as const;

    const getDefaultValues = () => {
        if (tipoActivo === 'afiliado-fisico') {
            return {
                Nombre: '',
                Apellido1: '',
                Apellido2: '',
                Cedula: '',
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
            try {
                // TODO: Implementar creación de afiliados cuando estén disponibles las funciones
                console.log('Crear afiliado:', tipoActivo, value);
                showSuccess(`${tipoActivo === 'afiliado-fisico' ? 'Afiliado físico' : 'Afiliado jurídico'} creado exitosamente`);
                onClose();
                form.reset();
            } catch (error) {
                console.error('Error creando registro:', error);
                showError('Error al crear el registro');
            }
        },
    });

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

            <form.Field name="Cedula">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cédula *
                        </label>
                        <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123456789"
                            required
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Numero_Telefono">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="88888888"
                            required
                        />
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
                            Escritura del Terreno (URL)
                        </label>
                        <input
                            type="url"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/escritura.pdf"
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno (URL)
                        </label>
                        <input
                            type="url"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/planos.pdf"
                        />
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
                    </div>
                )}
            </form.Field>

            <form.Field name="Numero_Telefono">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="88888888"
                            required
                        />
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
                            Escritura del Terreno (URL)
                        </label>
                        <input
                            type="url"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/escritura.pdf"
                        />
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno (URL)
                        </label>
                        <input
                            type="url"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://ejemplo.com/planos.pdf"
                        />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Crear {tipoActivo.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;