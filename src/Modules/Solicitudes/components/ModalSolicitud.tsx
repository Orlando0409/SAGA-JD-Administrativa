import React from 'react';
import { X, User, Check, XCircle } from 'lucide-react';
import { useAprobarSolicitudAfiliacion, useRechazarSolicitudAfiliacion } from '../Hooks/Fisico Update/HookAfiliadoFisico';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import { useAprobarSolicitudCambioMedidor, useRechazarSolicitudCambioMedidor } from '../Hooks/Fisico Update/HookCambioMedidorFisico';
import { useAprobarSolicitudAsociado, useRechazarSolicitudAsociado } from '../Hooks/Fisico Update/HookAsociadoFisico';
import { useAprobarSolicitudDesconexion, useRechazarSolicitudDesconexion } from '../Hooks/Fisico Update/HookDesconexionMedidorFisico';
import { useAprobarSolicitudAfiliacionJuridica, useRechazarSolicitudAfiliacionJuridica } from '../Hooks/Juridico Update/HookAfiliadoJuridico';
import { useAprobarSolicitudAsociadoJuridico, useRechazarSolicitudAsociadoJuridico } from '../Hooks/Juridico Update/HookAsociadoJuridico';
import { useAprobarSolicitudCambioMedidorJuridica, useRechazarSolicitudCambioMedidorJuridica } from '../Hooks/Juridico Update/HookCambioMedidorJuridico';
import { useAprobarSolicitudDesconexionJuridica, useRechazarSolicitudDesconexionJuridica } from '../Hooks/Juridico Update/HookDesconexionMedidor';

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
    // Hooks para manejar los cambios de estado
    const aprobarAfiliacionMutation = useAprobarSolicitudAfiliacion();
    const rechazarAfiliacionMutation = useRechazarSolicitudAfiliacion();
    const aprobarCambioMedidorMutation = useAprobarSolicitudCambioMedidor();
    const rechazarCambioMedidorMutation = useRechazarSolicitudCambioMedidor();
    const aprobarAsociadoMutation = useAprobarSolicitudAsociado();
    const rechazarAsociadoMutation = useRechazarSolicitudAsociado();
    const aprobarDesconexionMutation = useAprobarSolicitudDesconexion();
    const rechazarDesconexionMutation = useRechazarSolicitudDesconexion();
    const aprobarAfiliacionJuridicaMutation = useAprobarSolicitudAfiliacionJuridica();
    const rechazarAfiliacionJuridicaMutation = useRechazarSolicitudAfiliacionJuridica();
    const aprobarAsociadoJuridicoMutation = useAprobarSolicitudAsociadoJuridico();
    const rechazarAsociadoJuridicoMutation = useRechazarSolicitudAsociadoJuridico();
    const aprobarCambioMedidorJuridicoMutation = useAprobarSolicitudCambioMedidorJuridica();
    const rechazarCambioMedidorJuridicoMutation = useRechazarSolicitudCambioMedidorJuridica();
    const aprobarDesconexionJuridicoMutation = useAprobarSolicitudDesconexionJuridica();
    const rechazarDesconexionJuridicoMutation = useRechazarSolicitudDesconexionJuridica();
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

            return {
                id: solicitudId,
                nombre: `${datos.Nombre || ''} ${datos.Apellido1 || ''} ${datos.Apellido2 || ''}`.trim() || 'Sin nombre',
                documento: datos.Cedula || 'Sin cédula',
                tipo: 'Física',
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
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


            

            return {
                id: solicitudId,
                nombre: datos.Razon_Social || 'Sin razón social',
                documento: datos.Cedula_Juridica || 'Sin cédula jurídica',
                tipo: 'Jurídica',
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
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

    // Función para manejar aprobación por casos
    const handleAprobar = async () => {
        if (confirm(`¿Está seguro de APROBAR la solicitud de ${info.nombre}?`)) {
            try {
                const tipoSolicitud = solicitud.tipoSolicitud || info.tipoSolicitud;
                const tipoPersona = solicitud.tipo; // 'solicitud-fisica' o 'solicitud-juridica'

                console.log(` Aprobando solicitud: Tipo Persona: ${tipoPersona}, Tipo Solicitud: ${tipoSolicitud}`);

                // Determinar qué mutación usar basado en tipo de persona y tipo de solicitud
                if (tipoPersona === 'solicitud-fisica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await aprobarAfiliacionMutation.mutateAsync(info.id);
                            break;
                        case 'Cambio de Medidor':
                            await aprobarCambioMedidorMutation.mutateAsync(info.id);
                            break;
                        case 'Asociado':
                            await aprobarAsociadoMutation.mutateAsync(info.id);
                            break;
                        case 'Desconexion':
                            await aprobarDesconexionMutation.mutateAsync(info.id);
                            break;
                        default:
                            // Fallback a afiliación física si no se especifica tipo
                            await aprobarAfiliacionMutation.mutateAsync(info.id);
                            console.warn(' Tipo de solicitud física no especificado, usando Afiliación como fallback');
                    }
                } else if (tipoPersona === 'solicitud-juridica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await aprobarAfiliacionJuridicaMutation.mutateAsync(info.id);
                            break;
                        case 'Cambio de Medidor':
                            await aprobarCambioMedidorJuridicoMutation.mutateAsync(info.id);
                            break;
                        case 'Asociado':
                            await aprobarAsociadoJuridicoMutation.mutateAsync(info.id);
                            break;
                        case 'Desconexion':
                            await aprobarDesconexionJuridicoMutation.mutateAsync(info.id);
                            break;
                        default:
                            // Fallback a afiliación jurídica si no se especifica tipo
                            await aprobarAfiliacionJuridicaMutation.mutateAsync(info.id);
                            console.warn(' Tipo de solicitud jurídica no especificado, usando Afiliación como fallback');
                    }
                } else {
                    console.error(' Tipo de persona no reconocido:', tipoPersona);
                    throw new Error('Tipo de solicitud no válido');
                }

                alert(' Solicitud aprobada exitosamente');
                onClose(); // Cerrar modal después del éxito
            } catch (error) {
                console.error('Error al aprobar:', error);
                alert(' Error al aprobar la solicitud');
            }
        }
    };

    // Función para manejar rechazo por casos
    const handleRechazar = async () => {
        if (confirm(`¿Está seguro de RECHAZAR la solicitud de ${info.nombre}?`)) {
            try {
                const tipoSolicitud = solicitud.tipoSolicitud || info.tipoSolicitud;
                const tipoPersona = solicitud.tipo; // 'solicitud-fisica' o 'solicitud-juridica'

                console.log(` Rechazando solicitud: Tipo Persona: ${tipoPersona}, Tipo Solicitud: ${tipoSolicitud}`);

                // Determinar qué mutación usar basado en tipo de persona y tipo de solicitud
                if (tipoPersona === 'solicitud-fisica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await rechazarAfiliacionMutation.mutateAsync(info.id);
                            break;
                        case 'Cambio de Medidor':
                            await rechazarCambioMedidorMutation.mutateAsync(info.id);
                            break;
                        case 'Asociado':
                            await rechazarAsociadoMutation.mutateAsync(info.id);
                            break;
                        case 'Desconexion':
                            await rechazarDesconexionMutation.mutateAsync(info.id);
                            break;
                        default:
                            // Fallback a afiliación física si no se especifica tipo
                            await rechazarAfiliacionMutation.mutateAsync(info.id);
                            console.warn(' Tipo de solicitud física no especificado, usando Afiliación como fallback');
                    }
                } else if (tipoPersona === 'solicitud-juridica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await rechazarAfiliacionJuridicaMutation.mutateAsync(info.id);
                            break;
                        case 'Cambio de Medidor':
                            await rechazarCambioMedidorJuridicoMutation.mutateAsync(info.id);
                            break;
                        case 'Asociado':
                            await rechazarAsociadoJuridicoMutation.mutateAsync(info.id);
                            break;
                        case 'Desconexion':
                            await rechazarDesconexionJuridicoMutation.mutateAsync(info.id);
                            break;
                        default:
                            // Fallback a afiliación jurídica si no se especifica tipo
                            await rechazarAfiliacionJuridicaMutation.mutateAsync(info.id);
                            console.warn(' Tipo de solicitud jurídica no especificado, usando Afiliación como fallback');
                    }
                } else {
                    console.error(' Tipo de persona no reconocido:', tipoPersona);
                    throw new Error('Tipo de solicitud no válido');
                }

                alert(' Solicitud rechazada');
                onClose(); // Cerrar modal después del éxito
            } catch (error) {
                console.error('Error al rechazar:', error);
                alert(' Error al rechazar la solicitud');
            }
        }
    };

    const isLoading =
        // Mutaciones físicas
        aprobarAfiliacionMutation.isPending || rechazarAfiliacionMutation.isPending ||
        aprobarCambioMedidorMutation.isPending || rechazarCambioMedidorMutation.isPending ||
        aprobarAsociadoMutation.isPending || rechazarAsociadoMutation.isPending ||
        aprobarDesconexionMutation.isPending || rechazarDesconexionMutation.isPending ||
        // Mutaciones jurídicas
        aprobarAfiliacionJuridicaMutation.isPending || rechazarAfiliacionJuridicaMutation.isPending ||
        aprobarCambioMedidorJuridicoMutation.isPending || rechazarCambioMedidorJuridicoMutation.isPending ||
        aprobarAsociadoJuridicoMutation.isPending || rechazarAsociadoJuridicoMutation.isPending ||
        aprobarDesconexionJuridicoMutation.isPending || rechazarDesconexionJuridicoMutation.isPending;

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
                                onClick={handleAprobar}
                                disabled={isLoading || info.estado === 'Aprobada'}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Aprobando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Aprobar Solicitud
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleRechazar}
                                disabled={isLoading || info.estado === 'Aprobada' || info.estado === 'Rechazada'}
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
                                        Rechazar Solicitud
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
        </div>
    );
};

export default ModalSolicitud;