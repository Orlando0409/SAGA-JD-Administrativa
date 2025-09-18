import React from 'react';
import { X } from 'lucide-react';
import { useAprobarSolicitud, useRechazarSolicitud } from '../Hooks/HookUpdateEstadoSolicitud';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';

interface ModalSolicitudProps {
    isOpen: boolean;
    onClose: () => void;
    solicitud: {
        tipo: 'solicitud-fisica' | 'solicitud-juridica';
        datos: SolicitudFisica | SolicitudJuridica;
    };
}

/**
 * 🎛️ Modal simple para gestionar estados de solicitudes
 * Incluye botones para aprobar y rechazar
 */
const ModalSolicitud: React.FC<ModalSolicitudProps> = ({ isOpen, onClose, solicitud }) => {
    // Hooks para manejar los cambios de estado
    const aprobarMutation = useAprobarSolicitud();
    const rechazarMutation = useRechazarSolicitud();

    // Extraer información básica de la solicitud
    const getSolicitudInfo = () => {
        console.log('🔍 Datos completos de la solicitud:', solicitud.datos);

        if (solicitud.tipo === 'solicitud-fisica') {
            const datos = solicitud.datos as any; // Usamos any para acceder a propiedades no tipadas

            // Buscar el ID real en diferentes posibles propiedades
            let solicitudId = datos.id || datos.Id || datos.ID || datos.solicitudId || datos.Id_Solicitud;

            console.log('🆔 ID encontrado para solicitud física:', solicitudId);
            console.log('📋 Todas las propiedades disponibles:', Object.keys(datos));

            // Si no encontramos ID, usamos la cédula como fallback (temporal)
            if (!solicitudId) {
                console.warn('⚠️ No se encontró ID real, usando cédula como fallback');
                solicitudId = datos.Cedula || `temp-${Date.now()}`;
            }

            return {
                id: solicitudId,
                nombre: `${datos.Nombre || ''} ${datos.Apellido1 || ''} ${datos.Apellido2 || ''}`.trim() || 'Sin nombre',
                documento: datos.Cedula || 'Sin cédula',
                tipo: 'Física',
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado'
            };
        } else {
            const datos = solicitud.datos as any; // Usamos any para acceder a propiedades no tipadas

            // Buscar el ID real en diferentes posibles propiedades
            let solicitudId = datos.id || datos.Id || datos.ID || datos.solicitudId || datos.Id_Solicitud;

            console.log('🆔 ID encontrado para solicitud jurídica:', solicitudId);
            console.log('📋 Todas las propiedades disponibles:', Object.keys(datos));

            // Si no encontramos ID, usamos la cédula jurídica como fallback (temporal)
            if (!solicitudId) {
                console.warn('⚠️ No se encontró ID real, usando cédula jurídica como fallback');
                solicitudId = datos.Cedula_Juridica || `temp-${Date.now()}`;
            }

            return {
                id: solicitudId,
                nombre: datos.Razon_Social || 'Sin razón social',
                documento: datos.Cedula_Juridica || 'Sin cédula jurídica',
                tipo: 'Jurídica',
                tipoSolicitud: datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado'
            };
        }
    };

    const info = getSolicitudInfo();

    // Función para manejar aprobación
    const handleAprobar = async () => {
        if (confirm(`¿Está seguro de APROBAR la solicitud de ${info.nombre}?`)) {
            try {
                await aprobarMutation.mutateAsync(info.id);
                alert('✅ Solicitud aprobada exitosamente');
                onClose(); // Cerrar modal después del éxito
            } catch (error) {
                console.error('Error al aprobar:', error);
                alert('❌ Error al aprobar la solicitud');
            }
        }
    };

    // Función para manejar rechazo
    const handleRechazar = async () => {
        if (confirm(`¿Está seguro de RECHAZAR la solicitud de ${info.nombre}?`)) {
            try {
                await rechazarMutation.mutateAsync(info.id);
                alert('❌ Solicitud rechazada');
                onClose(); // Cerrar modal después del éxito
            } catch (error) {
                console.error('Error al rechazar:', error);
                alert('❌ Error al rechazar la solicitud');
            }
        }
    };

    const isLoading = aprobarMutation.isPending || rechazarMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        🎛️ Gestionar Solicitud
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    {/* Información de la solicitud */}
                    <div className="mb-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">ID:</span>
                            <span className="text-sm text-gray-800">{info.id}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Nombre:</span>
                            <span className="text-sm text-gray-800 text-right">{info.nombre}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Documento:</span>
                            <span className="text-sm text-gray-800">{info.documento}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Tipo:</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${info.tipo === 'Física'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                                }`}>
                                {info.tipo === 'Física' ? '👤' : '🏢'} {info.tipo}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Solicitud:</span>
                            <span className="text-sm text-gray-800">{info.tipoSolicitud}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Estado actual:</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${info.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                                info.estado === 'Aprobada' ? 'bg-green-100 text-green-700' :
                                    info.estado === 'Rechazada' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {info.estado}
                            </span>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleAprobar}
                            disabled={isLoading || info.estado === 'Aprobada'}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {aprobarMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Aprobando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    ✅ Aprobar
                                </span>
                            )}
                        </button>

                        <button
                            onClick={handleRechazar}
                            disabled={isLoading || info.estado === 'Rechazada'}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {rechazarMutation.isPending ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Rechazando...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    ❌ Rechazar
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Botón cancelar */}
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full mt-3 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalSolicitud;
