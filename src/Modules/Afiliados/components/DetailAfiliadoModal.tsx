import { LuX, LuUser, LuMail, LuPhone, LuMapPin, LuCalendar, LuBuilding, LuFileText, LuMap, LuInfo, LuGauge } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { formatCedulaJuridica } from '../Helper/formatUtils';
import type { AfiliadoFisico, Medidor } from '../Models/TablaAfiliados/ModeloAfiliadoFisico';
import type { AfiliadoJuridico } from '../Models/TablaAfiliados/ModeloAfiliadoJuridico';
import { getMedidoresByAfiliado, getMedidoresByAfiliadoJuridico } from '../Service/ServiceAfiliadoFisico';


// Tipo unificado para identificar qué estamos viendo
type PersonaParaDetalle = {
    tipo: 'afiliado-fisico' | 'afiliado-juridico';
    datos: AfiliadoFisico | AfiliadoJuridico;
};

interface DetailAbonadosProps {
    persona: PersonaParaDetalle;
    isOpen: boolean;
    onClose: () => void;
}

const DetailAbonados: React.FC<DetailAbonadosProps> = ({ persona, isOpen, onClose }) => {

    const [medidores, setMedidores] = useState<Medidor[]>([]);
    const [loadingMedidores, setLoadingMedidores] = useState(false);

    // Cada vez que se abre el modal, cargar los medidores frescos desde el endpoint
    useEffect(() => {
        if (!isOpen) return;
        const idAfiliado = (persona.datos as AfiliadoFisico | AfiliadoJuridico).Id_Afiliado;

        // Primero mostrar los medidores que ya vienen embebidos en los datos del listado
        const mediadoresEmbebidos =
            (persona.datos as AfiliadoFisico).Medidores ??
            (persona.datos as AfiliadoFisico).medidores ??
            [];
        setMedidores(mediadoresEmbebidos);

        // Luego hacer el fetch fresco para tener todos los medidores actualizados
        setLoadingMedidores(true);
        const fetchFn = persona.tipo === 'afiliado-juridico'
            ? getMedidoresByAfiliadoJuridico
            : getMedidoresByAfiliado;
        fetchFn(idAfiliado)
            .then((data) => {
                // Siempre usar el resultado fresco del endpoint
                setMedidores(data);
            })
            .catch(() => {
                // Silencioso — ya mostramos los embebidos como fallback
            })
            .finally(() => setLoadingMedidores(false));
    }, [isOpen, persona]);

    const getPersonaInfo = () => {
        const { tipo, datos } = persona;

        if (tipo === 'afiliado-fisico') {
            const afiliado = datos as AfiliadoFisico;
            return {
                id: afiliado.Id_Afiliado,
                nombre: `${afiliado.Nombre} ${afiliado.Apellido1} ${afiliado.Apellido2?.includes('No Proporcionado') ? '' : afiliado.Apellido2 || ''}`.trim(),
                documento: afiliado.Identificacion,

                telefono: afiliado.Numero_Telefono,
                correo: afiliado.Correo,
                direccion: afiliado.Direccion_Exacta,
                estado: afiliado.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: afiliado.Estado?.Id_Estado_Afiliado || 0,
                tipoPersona: 'Físico',
                tipoAfiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado || 'Asociado',
                edad: afiliado.Edad,
                fechaCreacion: afiliado.Fecha_Creacion,
                fechaActualizacion: afiliado.Fecha_Actualizacion,
                certificacion: afiliado.Certificacion_Literal,
                planos: afiliado.Planos_Terreno,
                motivo: null, // Campo no disponible en el modelo actual
                medidores // Cargados desde el endpoint por el useEffect
            };
        } else { // afiliado-juridico
            const afiliado = datos as AfiliadoJuridico;
            return {
                id: afiliado.Id_Afiliado,
                nombre: afiliado.Razon_Social,
                documento: formatCedulaJuridica(afiliado.Cedula_Juridica || ''),
                tipoDocumento: 'Cédula Jurídica',
                telefono: afiliado.Numero_Telefono,
                correo: afiliado.Correo,
                direccion: afiliado.Direccion_Exacta,
                estado: afiliado.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: afiliado.Estado?.Id_Estado_Afiliado || 0,
                tipoPersona: 'Jurídico',
                tipoAfiliado: afiliado.Tipo_Afiliado?.Nombre_Tipo_Afiliado || 'Asociado',
                edad: null,
                fechaCreacion: afiliado.Fecha_Creacion,
                fechaActualizacion: afiliado.Fecha_Actualizacion,
                certificacion: afiliado.Certificacion_Literal,
                planos: afiliado.Planos_Terreno,
                motivo: null, // Campo no disponible en el modelo actual
                medidores // Cargados desde el endpoint por el useEffect
            };
        }
    };

    const formatDate = (date: string | Date | null) => {
        if (!date) return 'No disponible';
        try {
            return new Date(date).toLocaleDateString('es-CR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Fecha inválida';
        }
    };

    const getStatusColor = (estadoId: number) => {
        // Colores según el estado
        switch (estadoId) {
            case 1: // Activo
                return 'bg-green-100 text-green-800 border-green-200';
            case 2: // Inactivo
                return 'bg-red-100 text-red-800 border-red-200';
            case 3: // Pendiente
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTipoAfiliadoColor = (tipo: string) => {
        return tipo === 'Físico'
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : 'bg-blue-100 text-blue-800 border-blue-200';
    };

    const getModalTitle = () => {
        switch (persona.tipo) {
            case 'afiliado-fisico':
                return ' Detalle del Afiliado Físico';
            case 'afiliado-juridico':
                return ' Detalle del Afiliado Jurídico';
            default:
                return 'Detalle';
        }
    };

    if (!isOpen) return null;

    const personaInfo = getPersonaInfo();

    return (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">{getModalTitle()}</h1>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <LuX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                    
                    {/* Información Personal */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <LuUser className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Información Personal</h3>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre/Razón Social */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                                    <div className="p-2 rounded-lg">
                                        <LuUser className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            {personaInfo.tipoPersona === 'Físico' ? 'Nombre Completo' : 'Razón Social'}
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {personaInfo.nombre}
                                        </p>
                                    </div>
                                </div>

                                {/* Documento */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuFileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            {personaInfo.tipoPersona === 'Físico' ? 'Identificación' : 'Cédula Jurídica'}
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {personaInfo.documento}
                                        </p>
                                    </div>
                                </div>

                                {/* Edad (solo para físicos) */}
                                {personaInfo.edad && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="p-2 rounded-lg">
                                            <LuCalendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Edad
                                            </p>
                                            <p className="text-base font-medium text-gray-900 mt-1">
                                                {personaInfo.edad} años
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Tipo de Persona */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuBuilding className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Tipo de Persona
                                        </p>
                                        <p className="text-base font-medium text-gray-900 mt-1">
                                            {personaInfo.tipoPersona}
                                        </p>
                                    </div>
                                </div>

                                {/* Tipo de Afiliado */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuUser className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Tipo de Afiliado
                                        </p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getTipoAfiliadoColor(personaInfo.tipoAfiliado)}`}
                                        >
                                            {personaInfo.tipoAfiliado}
                                        </span>
                                    </div>
                                </div>

                                {/* Certificación Literal */}
                                {personaInfo.certificacion && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="p-2 rounded-lg">
                                            <LuFileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Certificación Literal
                                            </p>
                                            <a
                                                href={personaInfo.certificacion}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-medium underline mt-1 inline-block"
                                            >
                                                Ver documento
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Planos del Terreno */}
                                {personaInfo.planos && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="p-2 rounded-lg">
                                            <LuMap className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Planos del Terreno
                                            </p>
                                            <a
                                                href={personaInfo.planos}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-medium underline mt-1 inline-block"
                                            >
                                                Ver documento
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Medidores Asignados */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <LuGauge className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Medidores Asignados
                                    {loadingMedidores && (
                                        <span className="ml-2 inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin align-middle" />
                                    )}
                                </h3>
                            </div>
                        </div>

                        <div className="p-5">
                            {personaInfo.medidores && personaInfo.medidores.length > 0 ? (
                                <div className="space-y-4">
                                    {personaInfo.medidores.map((medidor) => (
                                        <div
                                            key={medidor.Id_Medidor}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <LuGauge className="w-5 h-5 text-blue-600" />
                                                    <h4 className="text-base font-bold text-gray-900">
                                                        Medidor #{medidor.Id_Medidor}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                                                    <div className="p-2 rounded-lg">
                                                        <LuInfo className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500 uppercase">Número de Medidor</p>
                                                        <p className="text-base font-medium text-gray-900 mt-1">{medidor.Numero_Medidor}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                                                    <div className="p-2 rounded-lg">
                                                        <LuGauge className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-medium text-gray-500 uppercase">Estado Actual del medidor</p>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${
                                                            medidor.Estado_Medidor?.Id_Estado_Medidor === 2
                                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                                : 'bg-red-100 text-red-700 border border-red-300'
                                                        }`}>
                                                            {medidor.Estado_Medidor?.Nombre_Estado_Medidor ?? 'Sin estado'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {(medidor.Certificacion_Literal || medidor.Planos_Terreno) && (
                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Documentos del Terreno</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {medidor.Certificacion_Literal && (
                                                            <a
                                                                href={medidor.Certificacion_Literal}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors font-medium"
                                                            >
                                                                <LuFileText className="w-4 h-4" />
                                                                Ver Certificación
                                                            </a>
                                                        )}
                                                        {medidor.Planos_Terreno && (
                                                            <a
                                                                href={medidor.Planos_Terreno}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors font-medium"
                                                            >
                                                                <LuMap className="w-4 h-4" />
                                                                Ver Planos
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <LuGauge className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <p className="text-sm text-gray-500 font-medium">Sin medidores asignados</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <LuPhone className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Información de Contacto</h3>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Dirección */}
                                {personaInfo.direccion && (
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                                        <div className="p-2 rounded-lg">
                                            <LuMapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Dirección Exacta
                                            </p>
                                            <p className="text-base font-medium text-gray-900 mt-1 break-words">
                                                {personaInfo.direccion}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Correo */}
                                {personaInfo.correo && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                                    <div className="p-2 rounded-lg">
                                        <LuMail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Correo Electrónico
                                        </p>
                                        <p className="text-base font-medium text-gray-900 mt-1">
                                            {personaInfo.correo}
                                        </p>
                                    </div>
                                </div>
                                )}

                                {/* Teléfono */}
                                {personaInfo.telefono && (
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                                    <div className="p-2 rounded-lg">
                                        <LuPhone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Teléfono
                                        </p>
                                        <p className="text-base font-medium text-gray-900 mt-1">
                                            {personaInfo.telefono}
                                        </p>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información del Sistema */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <LuCalendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Información del Sistema</h3>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Estado */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuInfo className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Estado
                                        </p>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getStatusColor(personaInfo.estadoId)}`}
                                        >
                                            {personaInfo.estado}
                                        </span>
                                    </div>
                                </div>

                                {/* Espacio vacío para alineación */}
                                <div></div>

                                {/* Fecha de Creación */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuCalendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Fecha de Creación
                                        </p>
                                        <p className="text-base font-medium text-gray-900 mt-1">
                                            {formatDate(personaInfo.fechaCreacion)}
                                        </p>
                                    </div>
                                </div>

                                {/* Fecha de Actualización */}
                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="p-2 rounded-lg">
                                        <LuCalendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-500 uppercase">
                                            Última Actualización
                                        </p>
                                        <p className="text-base font-medium text-gray-900 mt-1">
                                            {formatDate(personaInfo.fechaActualizacion)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailAbonados;