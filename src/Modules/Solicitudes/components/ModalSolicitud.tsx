import React, { useState, useEffect } from 'react';
import { X, User, Check, XCircle } from 'lucide-react';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import ModalMedidor from './ModalMedidor';
import { useMarcarEnRevision, useAprobarYEnEspera, useCompletar, useRechazar } from '../Hooks/HookEstadosSolicitudes';
import { mapearTipoSolicitud, mapearTipoPersona } from '../Service/EstadoSolicitudes';
import type { TipoSolicitud, TipoPersona } from '../Types/EstadoSolicitudes';
import { useAlerts } from '@/Modules/Global/context/AlertContext';

interface ModalSolicitudProps {
    isOpen: boolean;
    onClose: () => void;
    solicitud: {
        tipo: 'solicitud-fisica' | 'solicitud-juridica';
        datos: SolicitudFisica | SolicitudJuridica;
        tipoSolicitud?: 'Afiliacion' | 'Cambio de Medidor' | 'Asociado' | 'Desconexion'; // Nuevo campo para identificar el subtipo
    };
}

//Modal simple para gestionar estados de solicitudes
const ModalSolicitud: React.FC<ModalSolicitudProps> = ({ isOpen, onClose, solicitud }) => {
    // Estado para controlar el modal de asignación de medidor
    const [showModalMedidor, setShowModalMedidor] = useState(false);

    // 🎯 HOOKS UNIFICADOS - Reemplaza a los 16+ hooks anteriores
    const marcarEnRevisionMutation = useMarcarEnRevision();
    const aprobarYEnEsperaMutation = useAprobarYEnEspera();
    const completarMutation = useCompletar();
    const rechazarMutation = useRechazar();

    // Sistema de alertas (para mensajes de advertencia)
    const { showWarning } = useAlerts();
    // Extraer información básica de la solicitud
    const getSolicitudInfo = () => {
        console.log(' Datos completos de la solicitud:', solicitud.datos);

        if (solicitud.tipo === 'solicitud-fisica') {
            const datos = solicitud.datos as any; // Usamos any para acceder a propiedades no tipadas

            // Buscar el ID real en diferentes posibles propiedades
            let solicitudId = datos.id || datos.Id || datos.ID || datos.solicitudId || datos.Id_Solicitud;

            console.log(' ID encontrado para solicitud física:', solicitudId);
            console.log(' Todas las propiedades disponibles:', Object.keys(datos));

            // Si no encontramos ID, usamos la cédula como fallback (temporal)
            if (!solicitudId) {
                console.warn(' No se encontró ID real, usando cédula como fallback');
                solicitudId = datos.Cedula || `temp-${Date.now()}`;
            }

            // ⚠️ IMPORTANTE: Usar Tipo_Entidad de los datos originales
            // Tipo_Entidad: 1 = Física, 2 = Jurídica
            const tipoEntidad = datos.Tipo_Entidad || datos.Id_Tipo_Entidad || 1;
            const tipoPersonaReal = tipoEntidad === 1 ? 'Físico' : 'Jurídico';
            console.log('📋 Modal - Tipo_Entidad:', tipoEntidad, '→', tipoPersonaReal);

            return {
                id: solicitudId,
                nombre: `${datos.Nombre || ''} ${datos.Apellido1 || ''} ${datos.Apellido2 || ''}`.trim() || 'Sin nombre',
                documento: datos.Cedula || 'Sin cédula',
                tipo: tipoPersonaReal, // ✅ Usar tipo real del backend
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: datos.Estado?.Id_Estado_Solicitud || 0,
                // Información personal completa
                Nombre: datos.Nombre || 'No especificado',
                Apellido1: datos.Apellido1 || 'No especificado',
                Apellido2: datos.Apellido2 || 'No especificado',
                Cedula: datos.Cedula || 'Sin cédula',
                Numero_Telefono: datos.Numero_Telefono || 'No especificado',
                Correo: datos.Correo || 'No especificado',
                Direccion_Exacta: datos.Direccion_Exacta || 'No especificada',
                Edad: datos.Edad || 'No especificada',
                // Información de la solicitud
                Motivo_Solicitud: datos.Motivo_Solicitud || 'No especificado',
                // Documentos (para todas las solicitudes)
                Escritura_Terreno: datos.Escritura_Terreno || 'No proporcionada',
                Planos_Terreno: datos.Planos_Terreno || 'No proporcionados',
                // Campos específicos para diferentes tipos de solicitud
                Numero_Medidor_Actual: datos.Numero_Medidor_Actual || 'No especificado',

            };
        } else {
            const datos = solicitud.datos as any; // Usamos any para acceder a propiedades no tipadas

            // Buscar el ID real en diferentes posibles propiedades
            let solicitudId = datos.id || datos.Id || datos.ID || datos.solicitudId || datos.Id_Solicitud;

            console.log(' ID encontrado para solicitud jurídica:', solicitudId);
            console.log(' Todas las propiedades disponibles:', Object.keys(datos));

            // Si no encontramos ID, usamos la cédula jurídica como fallback (temporal)
            if (!solicitudId) {
                console.warn(' No se encontró ID real, usando cédula jurídica como fallback');
                solicitudId = datos.Cedula_Juridica || `temp-${Date.now()}`;
            }

            // ⚠️ IMPORTANTE: Usar Tipo_Entidad de los datos originales
            // Tipo_Entidad: 1 = Física, 2 = Jurídica
            const tipoEntidad = datos.Tipo_Entidad || datos.Id_Tipo_Entidad || 2;
            const tipoPersonaReal = tipoEntidad === 1 ? 'Físico' : 'Jurídico';
            console.log('📋 Modal - Tipo_Entidad:', tipoEntidad, '→', tipoPersonaReal);

            return {
                id: solicitudId,
                nombre: datos.Razon_Social || 'Sin razón social',
                documento: datos.Cedula_Juridica || 'Sin cédula jurídica',
                tipo: tipoPersonaReal, // ✅ Usar tipo real del backend
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: datos.Estado?.Id_Estado_Solicitud || 0,
                // Información empresarial completa
                Razon_Social: datos.Razon_Social || 'Sin razón social',
                Cedula_Juridica: datos.Cedula_Juridica || 'Sin cédula jurídica',
                Numero_Telefono: datos.Numero_Telefono || 'No especificado',
                Correo: datos.Correo || datos.Email || 'No especificado',
                Direccion_Exacta: datos.Direccion_Exacta || 'No especificada',
                // Información legal
                Representante_Legal: datos.Representante_Legal || 'No especificado',
                Cedula_Representante: datos.Cedula_Representante || 'No especificada',
                // Información de la solicitud
                Fecha_Creacion: datos.Fecha_Creacion || datos.Created_At || 'No especificada',
                Motivo_Solicitud: datos.Motivo_Solicitud || 'No especificado',
                // Documentos (para todas las solicitudes)
                Escritura_Terreno: datos.Escritura_Terreno || 'No proporcionada',
                Planos_Terreno: datos.Planos_Terreno || 'No proporcionados',
                // Campos específicos para diferentes tipos de solicitud
                Numero_Medidor_Actual: datos.Numero_Medidor_Actual || 'No especificado',

            };
        }
    };

    const info = getSolicitudInfo();

    // useEffect para cambiar automáticamente a estado 2 (En Revisión) cuando se abre el modal
    useEffect(() => {
        const cambiarAEnRevision = async () => {
            if (isOpen && info.estadoId === 1) {
                try {
                    // Mapear los tipos a los valores internos
                    const tipoSolicitud: TipoSolicitud = mapearTipoSolicitud(info.tipoSolicitud);
                    const tipoPersona: TipoPersona = mapearTipoPersona(info.tipo);

                    console.log('🔄 Cambiando solicitud a estado En Revisión...');
                    console.log(`📋 Tipo: ${tipoSolicitud} | Persona: ${tipoPersona}`);

                    await marcarEnRevisionMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
                    console.log('✅ Solicitud cambiada a En Revisión');
                } catch (error) {
                    console.error('❌ Error al cambiar a En Revisión:', error);
                }
            }
        };

        cambiarAEnRevision();
    }, [isOpen, info.estadoId, info.id, info.tipoSolicitud, info.tipo]);

    // Función para manejar aprobación por casos usando hooks unificados
    const handleCambiarEstado = async () => {
        const estadoActual = info.estadoId;

        // Mapear los tipos
        const tipoSolicitud: TipoSolicitud = mapearTipoSolicitud(info.tipoSolicitud);
        const tipoPersona: TipoPersona = mapearTipoPersona(info.tipo);

        // Verificar si requiere asignación de medidor (Afiliación o Cambio de Medidor)
        const requiereAsignacionMedidor = info.tipoSolicitud === 'Afiliacion' || info.tipoSolicitud === 'Cambio de Medidor';

        // Estado 2 (En Revisión) → Decidir flujo según tipo de solicitud
        if (estadoActual === 2) {
            if (requiereAsignacionMedidor) {
                // Para Afiliación y Cambio de Medidor: Preguntar y si confirma, marcar En Espera y abrir modal de medidor
                const ok = window.confirm(`¿Desea aprobar la solicitud de ${info.nombre} y ponerla en espera para asignar medidor?`);
                if (!ok) return;

                try {
                    console.log(`✅ Aprobando y poniendo en espera: ${tipoSolicitud} - ${tipoPersona}`);
                    await aprobarYEnEsperaMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
                    // Abrir modal para asignar medidor inmediatamente después de cambiar a estado 3
                    setShowModalMedidor(true);
                } catch (error) {
                    console.error('❌ Error al marcar en aprobada y en espera:', error);
                }
            } else {
                // Para Asociado y Desconexión: Estado 2 → Estado 4 (Completada) directamente
                const ok = window.confirm(`¿Desea completar la solicitud de ${info.nombre}? (no requiere asignación de medidor)`);
                if (!ok) return;

                try {
                    console.log(`🎉 Completando solicitud ${info.tipoSolicitud} directamente desde Estado 2 (sin medidor)`);
                    await completarMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
                    onClose();
                } catch (error) {
                    console.error('❌ Error al completar solicitud:', error);
                }
            }
        }
        // Estado 3 (Aprobada y en espera) → Solo llega aquí si requiere medidor (Afiliación o Cambio de Medidor)
        else if (estadoActual === 3) {
            // Abrir modal de medidor directamente → Al asignar cambia a Estado 4 (Completada)
            console.log('🔓 Abriendo modal de medidor para asignar');
            setShowModalMedidor(true);
        }
        // Si ya está completada (Estado 4)
        else if (estadoActual === 4) {
            showWarning('Solicitud completada', 'Esta solicitud ya está completada');
        }
    };

    // Nueva función para aprobar después de asignar el medidor usando hooks unificados
    const aprobarSolicitudDespuesDeAsignar = async () => {
        try {
            // Mapear los tipos a los valores internos
            const tipoSolicitudInterno: TipoSolicitud = mapearTipoSolicitud(solicitud.tipoSolicitud || info.tipoSolicitud);
            const tipoPersonaInterno: TipoPersona = mapearTipoPersona(info.tipo);

            console.log(`🎉 Completando solicitud: ${tipoSolicitudInterno} - ${tipoPersonaInterno}`);

            // Usar el hook unificado para completar (Estado 3 → 4)
            await completarMutation.mutateAsync(tipoSolicitudInterno, tipoPersonaInterno, info.id);

            onClose(); // Cerrar modal principal después de aprobar
        } catch (error) {
            console.error('❌ Error al completar solicitud:', error);
        }
    };

    // Función para manejar rechazo usando hooks unificados
    const handleRechazar = async () => {
        const ok = window.confirm(`¿Está seguro de RECHAZAR la solicitud de ${info.nombre}?`);
        if (!ok) return;

        try {
            // Mapear los tipos a los valores internos
            const tipoSolicitudInterno: TipoSolicitud = mapearTipoSolicitud(solicitud.tipoSolicitud || info.tipoSolicitud);
            const tipoPersonaInterno: TipoPersona = mapearTipoPersona(info.tipo);

            console.log(`❌ Rechazando solicitud: ${tipoSolicitudInterno} - ${tipoPersonaInterno}`);

            // Usar el hook unificado para rechazar (Cualquier estado → 5)
            await rechazarMutation.mutateAsync(tipoSolicitudInterno, tipoPersonaInterno, info.id);

            onClose(); // Cerrar modal después del éxito
        } catch (error) {
            console.error('❌ Error al rechazar:', error);
        }
    };

    // 🎯 Estado de carga unificado - Mucho más simple ahora
    const isLoading =
        marcarEnRevisionMutation.isPending ||
        aprobarYEnEsperaMutation.isPending ||
        completarMutation.isPending ||
        rechazarMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur bg-opacity-10 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900">Gestionar Solicitud</h1>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                    {/* Header Card de la Solicitud */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg mb-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-blue-100 text-sm mb-1">{info.tipoSolicitud}</p>
                            </div>
                            <div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium shadow-sm ${info.estado === 'Pendiente' ? 'bg-white text-orange-600 border border-orange-300' :
                                    info.estado === 'Aprobada' ? 'bg-green-100 text-green-800 border border-green-300' :
                                        info.estado === 'Rechazada' ? 'bg-red-100 text-red-800 border border-red-300' :
                                            'bg-gray-100 text-gray-800 border border-gray-300'
                                    }`}>
                                    {info.estado}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* Información del Solicitante */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-white">Información del Solicitante</h3>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Columna izquierda */}
                                    <div className="space-y-3">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                Nombre Completo
                                            </label>
                                            <p className="text-sm font-medium text-gray-900">{info.nombre}</p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                {info.tipo === 'Física' ? 'Cédula' : 'Cédula Jurídica'}
                                            </label>
                                            <p className="text-sm text-gray-900">{info.documento}</p>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                Tipo de Persona
                                            </label>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${info.tipo === 'Física'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                {info.tipo === 'Física' ? 'Persona Física' : 'Persona Jurídica'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Columna derecha */}
                                    <div className="space-y-3">
                                        {info.Numero_Telefono && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    Teléfono
                                                </label>
                                                <p className="text-sm text-gray-900">{info.Numero_Telefono}</p>
                                            </div>
                                        )}

                                        {info.Correo && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    Correo Electrónico
                                                </label>
                                                <p className="text-sm text-gray-900 break-all">{info.Correo}</p>
                                            </div>
                                        )}

                                        {info.Direccion_Exacta && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    Dirección
                                                </label>
                                                <p className="text-sm text-gray-900">{info.Direccion_Exacta}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detalles de la Solicitud */}
                        {(info.Numero_Medidor_Actual || info.Motivo_Solicitud) && (
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-white">Detalles de la Solicitud</h3>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        {info.Numero_Medidor_Actual && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    Número de Medidor Actual
                                                </label>
                                                <p className="text-sm font-medium text-gray-900">{info.Numero_Medidor_Actual}</p>
                                            </div>
                                        )}

                                        {info.Motivo_Solicitud && (
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    Motivo de la Solicitud
                                                </label>
                                                <p className="text-sm text-gray-900">{info.Motivo_Solicitud}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Documentos Adjuntos */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-semibold text-white">Documentos Adjuntos</h3>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                            Escritura del Terreno
                                        </label>
                                        {info.Escritura_Terreno && info.Escritura_Terreno !== 'No proporcionada' ? (
                                            <a href={info.Escritura_Terreno} target="_blank" rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium">
                                                Ver documento
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">No proporcionada</p>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                            Planos del Terreno
                                        </label>
                                        {info.Planos_Terreno && info.Planos_Terreno !== 'No proporcionados' ? (
                                            <a href={info.Planos_Terreno} target="_blank" rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium">
                                                Ver documento
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500">No proporcionados</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
                    <button
                        onClick={handleCambiarEstado}
                        disabled={isLoading || info.estadoId === 4 || info.estadoId === 5}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                {info.estadoId === 2 ? 'Procesando...' : 'Aprobando...'}
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                {info.estadoId === 2
                                    ? (info.tipoSolicitud === 'Afiliacion' || info.tipoSolicitud === 'Cambio de Medidor'
                                        ? 'Aprobar y poner en espera'
                                        : 'Completar solicitud')
                                    : info.estadoId === 3
                                        ? 'Completar y asignar medidor'
                                        : 'Aprobar Solicitud'}
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleRechazar}
                        disabled={isLoading || info.estadoId === 4 || info.estadoId === 5}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Rechazando...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" />
                                Rechazar solicitud
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                        Cancelar
                    </button>

                </div>
            </div>

            {/* Modal de Asignación de Medidor */}
            {showModalMedidor && (
                <ModalMedidor
                    isOpen={showModalMedidor}
                    onClose={() => {
                        setShowModalMedidor(false);
                        // No cerrar el modal de solicitud automáticamente
                    }}
                    onMedidorAsignado={aprobarSolicitudDespuesDeAsignar}
                    afiliado={{
                        tipo: solicitud.tipo,
                        datos: solicitud.datos
                    }}
                />
            )}
        </div>
    );
};

export default ModalSolicitud;