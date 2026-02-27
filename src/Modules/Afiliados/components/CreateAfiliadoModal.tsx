import { useForm } from '@tanstack/react-form';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { useAfiliadosFisicos } from '../Hook/HookAfiliadoFisico';
import { useAfiliadosJuridicos } from '../Hook/HookAfiliadoJuridico';
import PhoneInputComponent from '@/Modules/Global/components/PhoneInputComponent';
import { useCedulaLookup } from '../Hook/useCedulaLookup';
import { User, Building2, X, Gauge, PlusCircle, Link2, Search, CheckCircle2 } from 'lucide-react';
import { getMedidoresDisponibles, createMedidor, asignarMedidorAAfiliado } from '@/Modules/Inventario/service/MedidorServices';
import type { Medidor } from '@/Modules/Inventario/models/Inventario';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TipoFormulario = 'afiliado-fisico' | 'afiliado-juridico';
type PanelMedidor = 'cerrado' | 'asignar' | 'agregar';
type MedidorPendiente =
    | { uid: string; tipo: 'asignar'; idMedidor: number; numeroMedidor: number | string }
    | { uid: string; tipo: 'agregar'; numeroMedidor: number };

const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
    const [tipoActivo, setTipoActivo] = useState<TipoFormulario>('afiliado-fisico');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [escrituraFile, setEscrituraFile] = useState<File | null>(null);
    const [planosFile, setPlanosFile] = useState<File | null>(null);
    const { showSuccess, showError } = useAlerts();
    const { createAfiliadoFisico } = useAfiliadosFisicos();
    const { createAfiliadoJuridico } = useAfiliadosJuridicos();

    // Estados para medidores múltiples
    const [medidoresPendientes, setMedidoresPendientes] = useState<MedidorPendiente[]>([]);
    const [panelMedidor, setPanelMedidor] = useState<PanelMedidor>('cerrado');
    const [medidoresDisponibles, setMedidoresDisponibles] = useState<Medidor[]>([]);
    const [loadingMedidores, setLoadingMedidores] = useState(false);
    const [searchMedidor, setSearchMedidor] = useState('');
    const [numeroNuevoMedidor, setNumeroNuevoMedidor] = useState('');

    const { lookup, isLoading: loadingCedula } = useCedulaLookup()

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
                Edad: '' as unknown as number,
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

    // Función para manejar el cambio de cédula con búsqueda automática
    const handleCedulaChange = async (cedula: string) => {
        form.setFieldValue('Identificacion', cedula);

        // Limpiar errores
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors['Identificacion'];
            return newErrors;
        });

        // Buscar datos solo si es cédula nacional y tiene 9 dígitos
        if (form.state.values.Tipo_Identificacion === 'Cedula Nacional' && /^\d{9}$/.test(cedula)) {
            const resultado = await lookup(cedula);
            if (resultado) {
                // Autocompletar campos con los datos de la API
                const nombre = resultado.firstname || '';
                const apellido1 = resultado.lastname1 || '';
                const apellido2 = resultado.lastname2 || '';
                
                form.setFieldValue('Nombre', nombre);
                form.setFieldValue('Apellido1', apellido1);
                form.setFieldValue('Apellido2', apellido2);
                
                // Actualizar contadores de caracteres
                setFieldCharCounts(prev => ({
                    ...prev,
                    Nombre: nombre.length,
                    Apellido1: apellido1.length,
                    Apellido2: apellido2.length
                }));
            }
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

    const tipoIdSchema = z.enum(['Cedula Nacional', 'Dimex', 'Pasaporte']);

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

                    const creadoF = await createAfiliadoFisico(formData);
                    const idCreadoF: number = creadoF?.Id_Afiliado ?? creadoF?.id ?? null;
                    if (idCreadoF && medidoresPendientes.length > 0) {
                        for (const mp of medidoresPendientes) {
                            if (mp.tipo === 'asignar') {
                                await asignarMedidorAAfiliado(mp.idMedidor, idCreadoF);
                            } else {
                                const nuevo = await createMedidor({ Numero_Medidor: mp.numeroMedidor });
                                await asignarMedidorAAfiliado(nuevo.Id_Medidor, idCreadoF);
                            }
                        }
                    }
                    showSuccess('Éxito', 'Afiliado físico creado exitosamente.');
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

                    const creadoJ = await createAfiliadoJuridico(formData);
                    const idCreadoJ: number = creadoJ?.Id_Afiliado ?? creadoJ?.id ?? null;
                    if (idCreadoJ && medidoresPendientes.length > 0) {
                        for (const mp of medidoresPendientes) {
                            if (mp.tipo === 'asignar') {
                                await asignarMedidorAAfiliado(mp.idMedidor, idCreadoJ);
                            } else {
                                const nuevo = await createMedidor({ Numero_Medidor: mp.numeroMedidor });
                                await asignarMedidorAAfiliado(nuevo.Id_Medidor, idCreadoJ);
                            }
                        }
                    }
                    showSuccess('Éxito', 'Afiliado jurídico creado exitosamente.');
                }

                // Cerrar modal y resetear formulario
                onClose();
                form.reset();
                setEscrituraFile(null);
                setPlanosFile(null);
                setMedidoresPendientes([]);
                setPanelMedidor('cerrado');
                setNumeroNuevoMedidor('');
                setSearchMedidor('');

            } catch (error: any) {
                console.error('Error creando registro:', error);
                const raw = error?.response?.data?.message;
                const msg = Array.isArray(raw) ? raw.join('\n') : raw || 'Error al crear el registro. Por favor intente nuevamente.';
                showError('Error', msg);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    // Resetear el formulario cuando cambie el tipo de afiliado
    useEffect(() => {
        form.reset();
        setFieldCharCounts({
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
        setValidationErrors({});
        setEscrituraFile(null);
        setPlanosFile(null);
        setMedidoresPendientes([]);
        setPanelMedidor('cerrado');
        setNumeroNuevoMedidor('');
        setSearchMedidor('');
    }, [tipoActivo]);

    // Mover la verificación de isOpen DESPUÉS de todos los hooks
    if (!isOpen) return null;

    // ─── Handlers medidores ───────────────────────────────────────────────────────
    const handleAbrirPanel = async (panel: PanelMedidor) => {
        setPanelMedidor(panel);
        setSearchMedidor('');
        setNumeroNuevoMedidor('');
        if (panel === 'asignar') {
            setLoadingMedidores(true);
            try {
                const lista = await getMedidoresDisponibles();
                setMedidoresDisponibles(lista);
            } catch {
                showError('Error', 'No se pudieron cargar los medidores disponibles.');
            } finally {
                setLoadingMedidores(false);
            }
        }
    };

    const handleAgregarAsignar = (m: Medidor) => {
        if (medidoresPendientes.some(p => p.tipo === 'asignar' && p.idMedidor === m.Id_Medidor)) return;
        setMedidoresPendientes(prev => [...prev, { uid: crypto.randomUUID(), tipo: 'asignar', idMedidor: m.Id_Medidor, numeroMedidor: m.Numero_Medidor }]);
        setPanelMedidor('cerrado');
    };

    const handleAgregarNuevo = () => {
        const num = parseInt(numeroNuevoMedidor);
        if (isNaN(num) || num < 1) { showError('Error', 'Ingresa un número de medidor válido.'); return; }
        setMedidoresPendientes(prev => [...prev, { uid: crypto.randomUUID(), tipo: 'agregar', numeroMedidor: num }]);
        setNumeroNuevoMedidor('');
        setPanelMedidor('cerrado');
    };

    const handleQuitarMedidor = (uid: string) => {
        setMedidoresPendientes(prev => prev.filter(p => p.uid !== uid));
    };

    const medidoresFiltrados = medidoresDisponibles.filter(m => {
        if (medidoresPendientes.some(p => p.tipo === 'asignar' && p.idMedidor === m.Id_Medidor)) return false;
        if (!searchMedidor.trim()) return true;
        return String(m.Numero_Medidor).includes(searchMedidor.trim());
    });

    const renderSeccionMedidor = () => (
        <div className="mt-6 pt-5 border-t border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-gray-700">Medidores <span className="text-gray-400 font-normal">(opcional)</span></h3>
                </div>
                {medidoresPendientes.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{medidoresPendientes.length} en lista</span>
                )}
            </div>

            {medidoresPendientes.length > 0 && (
                <ul className="space-y-2">
                    {medidoresPendientes.map(mp => (
                        <li key={mp.uid} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2">
                                {mp.tipo === 'asignar' ? <Link2 className="w-4 h-4 text-blue-500" /> : <PlusCircle className="w-4 h-4 text-blue-500" />}
                                <span className="text-sm font-medium text-gray-800">Medidor #{mp.numeroMedidor}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">{mp.tipo === 'asignar' ? 'Asignar' : 'Nuevo'}</span>
                            </div>
                            <button type="button" onClick={() => handleQuitarMedidor(mp.uid)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                        </li>
                    ))}
                </ul>
            )}

            {panelMedidor === 'cerrado' && (
                <div className="flex gap-2">
                    <button type="button" onClick={() => handleAbrirPanel('asignar')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Link2 className="w-4 h-4" /> Asignar existente
                    </button>
                    <button type="button" onClick={() => handleAbrirPanel('agregar')} className="flex items-center gap-1.5 px-3 py-2 text-sm text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <PlusCircle className="w-4 h-4" /> Agregar nuevo
                    </button>
                </div>
            )}

            {panelMedidor === 'asignar' && (
                <div className="border border-blue-200 rounded-xl p-3 space-y-3 bg-blue-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Seleccionar medidor existente</span>
                        <button type="button" onClick={() => setPanelMedidor('cerrado')} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Buscar por número..." value={searchMedidor} onChange={e => setSearchMedidor(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden max-h-44 overflow-y-auto bg-white">
                        {loadingMedidores ? (
                            <div className="flex items-center justify-center py-6 gap-2 text-sm text-gray-500"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />Cargando...</div>
                        ) : medidoresFiltrados.length === 0 ? (
                            <p className="py-6 text-center text-sm text-gray-400">No hay medidores disponibles</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {medidoresFiltrados.map(m => (
                                    <li key={m.Id_Medidor}>
                                        <button type="button" onClick={() => handleAgregarAsignar(m)} className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-blue-50 transition-colors text-sm">
                                            <span className="font-medium text-gray-800">Medidor #{m.Numero_Medidor}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{m.Estado_Medidor?.Nombre_Estado_Medidor}</span>
                                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {panelMedidor === 'agregar' && (
                <div className="border border-blue-200 rounded-xl p-3 space-y-3 bg-blue-50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">Crear nuevo medidor</span>
                        <button type="button" onClick={() => setPanelMedidor('cerrado')} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-2">
                        <input type="number" min={1} value={numeroNuevoMedidor} onChange={e => setNumeroNuevoMedidor(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAgregarNuevo())} placeholder="Ej: 10023" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                        <button type="button" onClick={handleAgregarNuevo} disabled={!numeroNuevoMedidor.trim()} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Añadir</button>
                    </div>
                    <p className="text-xs text-blue-600">Se creará el medidor y se asignará automáticamente al afiliado.</p>
                </div>
            )}
        </div>
    );

    const renderFormularioFisico = () => (
        <>
            {/* Tipo de Identificación */}
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
                            Tipo de Identificación <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="Tipo_Identificacion"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as 'Cedula Nacional' | 'Dimex' | 'Pasaporte')}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${field.state.meta.errors.length > 0
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            required
                        >
                            <option value="Cedula Nacional">Cédula Nacional</option>
                            <option value="Dimex">DIMEX</option>
                            <option value="Pasaporte">Pasaporte</option>
                        </select>
                        {renderError('Tipo_Identificacion', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            {/* Identificación */}
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
                            Número de Identificación <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="Identificacion"
                                type="text"
                                value={field.state.value}
                                onChange={async (e) => {
                                    const value = e.target.value;
                                    if (value.length <= 20) {
                                        setFieldCharCounts(prev => ({ ...prev, Identificacion: value.length }));
                                        await handleCedulaChange(value);
                                    }
                                }}
                                onBlur={field.handleBlur}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Identificacion)
                                        ? 'border-red-300 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                placeholder="123456789"
                                maxLength={20}
                                required
                                disabled={loadingCedula}
                            />
                            {loadingCedula && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>

                        {renderCharCounter(
                            fieldCharCounts.Identificacion,
                            20,
                            field.state.meta.errors.length > 0 || !!validationErrors.Identificacion
                        )}

                        {renderError('Identificacion', field.state.meta.errors)}
                        
                        {form.state.values.Tipo_Identificacion === 'Cedula Nacional'}
                    </div>
                )}
            </form.Field>

            {/* Nombre */}
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
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Nombre"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Nombre', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Nombre)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Tu nombre"
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

            {/* Primer Apellido */}
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
                            Primer Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Apellido1"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Apellido1', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Apellido1)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Tu primer apellido"
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

            {/* Segundo Apellido */}
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
                            Segundo Apellido <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Apellido2"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Apellido2', field.handleChange, 50)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Apellido2)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="Tu segundo apellido"
                            maxLength={50}
                            required
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
                            Número de Teléfono <span className="text-red-500">*</span>
                        </label>
                        <PhoneInputComponent
                            value={field.state.value || ''}
                            onChange={(value) => field.handleChange(value)}
                            onBlur={field.handleBlur}
                            hasError={field.state.meta.errors.length > 0}
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
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Correo"
                            type="email"
                            value={field.state.value}
                            onChange={createInputHandler('Correo', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Correo)
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
                            Dirección Exacta <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="Direccion_Exacta"
                            value={field.state.value}
                            onChange={createTextareaHandler('Direccion_Exacta', field.handleChange, 255)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Direccion_Exacta)
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
                            Edad <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Edad"
                            type="number"
                            value={field.state.value}
                            onChange={(e) => {
                                const raw = e.target.value;
                                field.handleChange(raw === '' ? ('' as unknown as number) : parseInt(raw));
                            }}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${field.state.meta.errors.length > 0
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
                            Escritura del Terreno <span className="text-red-500">*</span>
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
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno <span className="text-red-500">*</span>
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
                    </div>
                )}
            </form.Field>

        </>
    );

    const renderFormularioJuridico = () => (
        <>
            {/* Cédula Jurídica */}
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
                            Cédula Jurídica <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Cedula_Juridica"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Cedula_Juridica', field.handleChange, 12)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Cedula_Juridica)
                                    ? 'border-red-300 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                            placeholder="3-XXX-XXXXXX"
                            maxLength={12}
                            required
                        />

                        {renderCharCounter(
                            fieldCharCounts.Cedula_Juridica,
                            12,
                            field.state.meta.errors.length > 0 || !!validationErrors.Cedula_Juridica
                        )}

                        {renderError('Cedula_Juridica', field.state.meta.errors)}
                    </div>
                )}
            </form.Field>

            {/* Razón Social */}
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
                            Razón Social <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Razon_Social"
                            type="text"
                            value={field.state.value}
                            onChange={createInputHandler('Razon_Social', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Razon_Social)
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

            {/* Número de Teléfono */}
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
                            Número de Teléfono <span className="text-red-500">*</span>
                        </label>
                        <PhoneInputComponent
                            value={field.state.value || ''}
                            onChange={(value) => field.handleChange(value)}
                            onBlur={field.handleBlur}
                            hasError={field.state.meta.errors.length > 0}
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
                            Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="Correo_Juridico"
                            type="email"
                            value={field.state.value}
                            onChange={createInputHandler('Correo', field.handleChange, 100)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Correo)
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
                            Dirección Exacta <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="Direccion_Exacta_Juridico"
                            value={field.state.value}
                            onChange={createTextareaHandler('Direccion_Exacta', field.handleChange, 255)}
                            onBlur={field.handleBlur}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${(field.state.meta.errors.length > 0 || validationErrors.Direccion_Exacta)
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
                            Escritura del Terreno <span className="text-red-500">*</span>
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
                    </div>
                )}
            </form.Field>

            <form.Field name="Planos_Terreno">
                {(field) => (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Planos del Terreno <span className="text-red-500">*</span>
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
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {tipoActivo === 'afiliado-fisico' ? (
                            <User className="w-6 h-6 text-blue-600" />
                        ) : (
                            <Building2 className="w-6 h-6 text-blue-600" />
                        )}
                        <h2 className="text-xl font-semibold text-gray-900">
                            Nuevo afiliado {tipoActivo === 'afiliado-fisico' ? 'físico' : 'jurídico'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Botones para cambiar tipo de afiliado */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setTipoActivo('afiliado-fisico');
                                form.reset();
                                setEscrituraFile(null);
                                setPlanosFile(null);
                                setValidationErrors({});
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center ${tipoActivo === 'afiliado-fisico'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Físico
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTipoActivo('afiliado-juridico');
                                form.reset();
                                setEscrituraFile(null);
                                setPlanosFile(null);
                                setValidationErrors({});
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors flex-1 justify-center ${tipoActivo === 'afiliado-juridico'
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <Building2 className="w-4 h-4" />
                            Jurídico
                        </button>
                    </div>
                </div>

                {/* Contenido del formulario */}
                <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-280px)]">
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
                    {renderSeccionMedidor()}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        type="submit"
                        form="afiliado-form"
                        disabled={isSubmitting}
                        className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${isSubmitting
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isSubmitting ? 'Creando...' : `Crear Afiliado ${tipoActivo === 'afiliado-fisico' ? 'Físico' : 'Jurídico'}`}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;