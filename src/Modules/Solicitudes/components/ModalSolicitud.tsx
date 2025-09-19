import React from 'react';
import { Building, CornerUpLeft, User, X } from 'lucide-react';
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
        tipoSolicitud?: 'Afiliacion' | 'Cambio_Medidor' | 'Asociado' | 'Desconexion'; // Nuevo campo para identificar el subtipo
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
                        case 'Cambio_Medidor':
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
                        case 'Cambio_Medidor':
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
                        case 'Cambio_Medidor':
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
                        case 'Cambio_Medidor':
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
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Gestionar Solicitud
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                        <div className="w-5 h-5 text-gray-500 flex items-center justify-center">
                            <X size={20} />
                        </div>
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Información completa de la solicitud */}
                    <div className="mb-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            {/* Header con información básica */}
                            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-300">
                                <div className="flex-1">

                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${info.estado === 'Pendiente' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                        info.estado === 'Aprobada' ? 'bg-green-100 text-green-800 border border-green-300' :
                                            info.estado === 'Rechazada' ? 'bg-red-100 text-red-800 border border-red-300' :
                                                'bg-gray-100 text-gray-800 border border-gray-300'
                                        }`}>
                                        {info.estado}
                                    </span>
                                </div>
                            </div>

                            {/* Avatar y título */}
                            <div className="text-center mb-6">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${info.tipo === 'Física'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-purple-100 text-purple-600'
                                    }`}>
                                    {info.tipo === 'Física' ? <User size={24} /> : <Building size={24} />}
                                </div>
                                <h4 className="text-xl font-semibold text-gray-800 mb-1">{info.nombre}</h4>
                                <p className="text-sm text-gray-500 mb-2">{info.tipo === 'Física' ? 'Persona Física' : 'Persona Jurídica'}</p>
                                <span className="inline-block bg-blue-50 px-4 py-1 rounded-full text-sm font-medium text-blue-800">
                                    {info.tipoSolicitud.replace('_', ' ')}
                                </span>
                            </div>

                            {/* Información completa en un solo grid */}
                            <div className="space-y-6">
                                {/* Información Personal/Empresarial */}
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Información del Solicitante</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {info.tipo === 'Física' ? (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Nombre</label>
                                                    <div className="text-sm text-gray-800">{info.Nombre}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Primer Apellido</label>
                                                    <div className="text-sm text-gray-800">{info.Apellido1}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Segundo Apellido</label>
                                                    <div className="text-sm text-gray-800">{info.Apellido2}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Número de Cédula</label>
                                                    <div className="text-sm text-gray-800">{info.Cedula}</div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Edad</label>
                                                    <div className="text-sm text-gray-800">{info.Edad}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Número de Teléfono</label>
                                                    <div className="text-sm text-gray-800">{info.Numero_Telefono}</div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                                                    <div className="text-sm text-gray-800">{info.Correo}</div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Direccion Exacta</label>
                                                    <div className="text-sm text-gray-800">{info.Direccion_Exacta}</div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Motivo Solicitud</label>
                                                    <div className="text-sm text-gray-800">{info.Motivo_Solicitud}</div>
                                                </div>


                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Razón Social</label>
                                                    <div className="text-sm text-gray-800">{info.Razon_Social}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Cédula Jurídica</label>
                                                    <div className="text-sm text-gray-800">{info.Cedula_Juridica}</div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Teléfono</label>
                                                    <div className="text-sm text-gray-800">{info.Numero_Telefono}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                                                    <div className="text-sm text-gray-800">{info.Correo}</div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Dirección Exacta</label>
                                                    <div className="text-sm text-gray-800">{info.Direccion_Exacta}</div>
                                                </div>


                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Documentos */}
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Documentos Adjuntos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Escritura del Terreno</label>
                                            {info.Escritura_Terreno && info.Escritura_Terreno !== 'No proporcionada' ? (
                                                <a href={info.Escritura_Terreno} target="_blank" rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                    Ver documento
                                                </a>
                                            ) : (
                                                <div className="text-sm text-gray-500">No proporcionada</div>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Planos del Terreno</label>
                                            {info.Planos_Terreno && info.Planos_Terreno !== 'No proporcionados' ? (
                                                <a href={info.Planos_Terreno} target="_blank" rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800 underline">
                                                    Ver documento
                                                </a>
                                            ) : (
                                                <div className="text-sm text-gray-500">No proporcionados</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Información específica según el tipo de solicitud */}
                                {info.tipoSolicitud !== 'Afiliacion' && info.tipoSolicitud !== 'Sin tipo' && (

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {info.tipoSolicitud === 'Cambio_Medidor' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Número de Medidor Actual</label>
                                                    <div className="text-sm font-mono text-gray-800 bg-gray-50 px-3 py-2 rounded">{info.Numero_Medidor_Actual}</div>
                                                </div>

                                            </>
                                        )}
                                        {info.tipoSolicitud === 'Desconexion' && (
                                            <>

                                            </>
                                        )}
                                        {info.tipoSolicitud === 'Asociado' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Motivo de la Solicitud</label>
                                                <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{info.Motivo_Solicitud}</div>
                                            </div>
                                        )}
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleAprobar}
                            disabled={isLoading || info.estado === 'Aprobada' || info.estado === 'Rechazada'}
                            className="flex-1 px-4 py-3 bg-green-400 hover:bg-green-500 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Aprobando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center  gap-2">
                                    {info.estado === 'Aprobada' ? 'Aprobada' : info.estado === 'Rechazada' ? 'No Disponible' : 'Aprobar'}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleRechazar}
                            disabled={isLoading || info.estado === 'Aprobada' || info.estado === 'Rechazada'}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Rechazando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    {info.estado === 'Rechazada' ? 'Rechazada' : info.estado === 'Aprobada' ? 'No Disponible' : 'Rechazar'}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Botón cancelar */}
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSolicitud;
