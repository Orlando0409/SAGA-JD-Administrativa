import React, { useState, useEffect } from 'react';
import { X, User, Check, XCircle } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Modules/Global/components/Sidebar/ui/alert-dialog';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import ModalMedidor from './ModalMedidor';
import { useMarcarEnRevision, useAprobarYEnEspera, useCompletar, useRechazar } from '../Hooks/HookEstadosSolicitudes';
import { mapearTipoSolicitud, mapearTipoPersona } from '../Service/EstadoSolicitudes';
import type { TipoSolicitud, TipoPersona } from '../Types/EstadoSolicitudes';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import { updateEstadoMedidor } from '@/Modules/Inventario/service/MedidorServices';

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
    const [numeroMedidorAsignado, setNumeroMedidorAsignado] = useState<string | number | null>(null);

    // Estados para controlar los AlertDialog
    const [showAprobarDialog, setShowAprobarDialog] = useState(false);
    const [showCompletarDialog, setShowCompletarDialog] = useState(false);
    const [showRechazarDialog, setShowRechazarDialog] = useState(false);
    const [motivoRechazo, setMotivoRechazo] = useState(''); // ✅ AGREGAR ESTE ESTADO

    const marcarEnRevisionMutation = useMarcarEnRevision();
    const aprobarYEnEsperaMutation = useAprobarYEnEspera();
    const completarMutation = useCompletar();
    const rechazarMutation = useRechazar();
    const { showWarning } = useAlerts();
    // Extraer información básica de la solicitud
    const getSolicitudInfo = () => {
        if (solicitud.tipo === 'solicitud-fisica') {
            const datos = solicitud.datos as any;
            const numeroMedidorRaw = numeroMedidorAsignado ?? datos.Numero_Medidor_Actual ?? datos.Numero_Medidor ?? datos.Medidor?.Numero_Medidor ?? null;
            const numeroMedidorActual = numeroMedidorRaw !== null && numeroMedidorRaw !== undefined && `${numeroMedidorRaw}`.trim() !== ''
                ? `#${numeroMedidorRaw}`
                : 'No especificado';

            let solicitudId = datos.Id_Solicitud || datos.id || datos.Id || datos.ID || datos.solicitudId;

            if (!solicitudId) {
                solicitudId = datos.Identificacion || datos.Cedula || `temp-${Date.now()}`;
            }

            const tipoEntidad = datos.Tipo_Entidad;
            const tipoPersonaReal = tipoEntidad === 1 ? 'Física' : 'Jurídica';

            return {
                id: solicitudId,
                nombre: `${datos.Nombre || ''} ${datos.Apellido1 || ''} ${datos.Apellido2 || ''}`.trim() || 'Sin nombre',
                documento: datos.Identificacion || datos.Cedula || 'Sin identificación',
                tipo: tipoPersonaReal,
                tipoSolicitud: solicitud.tipoSolicitud || datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: datos.Estado?.Id_Estado_Solicitud || 0,
                Nombre: datos.Nombre || 'No especificado',
                Apellido1: datos.Apellido1 || 'No especificado',
                Apellido2: datos.Apellido2 || 'No especificado',
                Tipo_Identificacion: datos.Tipo_Identificacion || 'No especificado',
                Identificacion: datos.Identificacion || datos.Cedula || 'Sin identificación',
                Numero_Telefono: datos.Numero_Telefono || 'No especificado',
                Correo: datos.Correo || 'No especificado',
                Direccion_Exacta: datos.Direccion_Exacta || 'No especificada',
                Edad: datos.Edad || 'No especificada',
                Motivo_Solicitud: datos.Motivo_Solicitud || 'No especificado',
                Escritura_Terreno: datos.Escritura_Terreno || 'No proporcionada',
                Planos_Terreno: datos.Planos_Terreno || 'No proporcionados',
                Numero_Medidor_Actual: datos.Numero_Medidor_Actual || 'No especificado',
                Numero_Medidor: datos.Numero_Medidor ?? null,
                Id_Medidor: datos.Id_Medidor ?? null,
            };
        } else {
            const datos = solicitud.datos as any;
            const numeroMedidorRaw = numeroMedidorAsignado ?? datos.Numero_Medidor_Actual ?? datos.Numero_Medidor ?? datos.Medidor?.Numero_Medidor ?? null;
            const numeroMedidorActual = numeroMedidorRaw !== null && numeroMedidorRaw !== undefined && `${numeroMedidorRaw}`.trim() !== ''
                ? `#${numeroMedidorRaw}`
                : 'No especificado';

            let solicitudId = datos.Id_Solicitud || datos.id || datos.Id || datos.ID || datos.solicitudId;

            if (!solicitudId) {
                solicitudId = datos.Cedula_Juridica || `temp-${Date.now()}`;
            }

            const tipoEntidad = datos.Tipo_Entidad;
            const tipoPersonaReal = tipoEntidad === 1 ? 'Física' : 'Jurídica';

            return {
                id: solicitudId,
                nombre: datos.Razon_Social || 'Sin razón social',
                documento: datos.Cedula_Juridica || 'Sin cédula jurídica',
                tipo: tipoPersonaReal,
                tipoSolicitud: solicitud.tipoSolicitud || datos.Tipo_Solicitud || 'Sin tipo',
                estado: datos.Estado?.Nombre_Estado || 'Sin estado',
                estadoId: datos.Estado?.Id_Estado_Solicitud || 0,
                Razon_Social: datos.Razon_Social || 'Sin razón social',
                Cedula_Juridica: datos.Cedula_Juridica || 'Sin cédula jurídica',
                Numero_Telefono: datos.Numero_Telefono || 'No especificado',
                Correo: datos.Correo || datos.Email || 'No especificado',
                Direccion_Exacta: datos.Direccion_Exacta || 'No especificada',
                Representante_Legal: datos.Representante_Legal || 'No especificado',
                Cedula_Representante: datos.Cedula_Representante || 'No especificada',
                Fecha_Creacion: datos.Fecha_Creacion || datos.Created_At || 'No especificada',
                Motivo_Solicitud: datos.Motivo_Solicitud || 'No especificado',
                Escritura_Terreno: datos.Escritura_Terreno || 'No proporcionada',
                Planos_Terreno: datos.Planos_Terreno || 'No proporcionados',
                Numero_Medidor_Actual: datos.Numero_Medidor_Actual || 'No especificado',
                Numero_Medidor: datos.Numero_Medidor ?? null,
                Id_Medidor: datos.Id_Medidor ?? null,
            };
        }
    };

    const info = getSolicitudInfo();


    useEffect(() => {
        const cambiarAEnRevision = async () => {
            if (isOpen && info.estadoId === 1) {
                try {
                    // Mapear los tipos a los valores internos
                    const tipoSolicitud: TipoSolicitud = mapearTipoSolicitud(info.tipoSolicitud);
                    const tipoPersona: TipoPersona = mapearTipoPersona(info.tipo);

                    await marcarEnRevisionMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
                } catch (error) {
                    console.error('Error al cambiar a En Revisión:', error);
                }
            }
        };

        cambiarAEnRevision();
    }, [isOpen, info.estadoId, info.id, info.tipoSolicitud, info.tipo]);

    // Resetear el número de medidor asignado cuando el modal se abre (para traer datos frescos del backend)
    useEffect(() => {
        if (isOpen) {
            setNumeroMedidorAsignado(null);
        }
    }, [isOpen]);
 
    // Función para manejar aprobación por casos usando hooks unificados
    const handleCambiarEstado = async () => {
        const estadoActual = info.estadoId;

        // Verificar si requiere asignación de medidor (Afiliación o Cambio de Medidor)
        const requiereAsignacionMedidor = info.tipoSolicitud === 'Afiliacion' || info.tipoSolicitud === 'Cambio de Medidor';

        // Estado 2 (En Revisión) → Decidir flujo según tipo de solicitud
        if (estadoActual === 2) {
            if (requiereAsignacionMedidor) {
                // Para Afiliación y Cambio de Medidor: Abrir diálogo de confirmación
                setShowAprobarDialog(true);
            } else {
                // Para Asociado y Desconexión: Abrir diálogo de completar directamente
                setShowCompletarDialog(true);
            }
        }
        else if (estadoActual === 3) {
            setShowModalMedidor(true);
        }
        else if (estadoActual === 4) {
            showWarning('Solicitud completada', 'Esta solicitud ya está completada');
        }
    };

    // Nueva función para aprobar después de asignar el medidor usando hooks unificados
    const aprobarSolicitudDespuesDeAsignar = async () => {
        try {
            const tipoSolicitudInterno: TipoSolicitud = mapearTipoSolicitud(solicitud.tipoSolicitud || info.tipoSolicitud);
            const tipoPersonaInterno: TipoPersona = mapearTipoPersona(info.tipo);

            // Si es Cambio de Medidor y hay un medidor registrado, marcarlo como Averiado (estado 3)
            if (info.tipoSolicitud === 'Cambio de Medidor' && info.Id_Medidor) {
                try {
                    await updateEstadoMedidor(info.Id_Medidor, 3);
                    console.log(`Medidor #${info.Id_Medidor} marcado como Averiado`);
                } catch (medidorError) {
                    console.error('Error al marcar medidor como averiado:', medidorError);
                    // No interrumpir el flujo principal si falla el cambio de estado del medidor
                }
            }

            await completarMutation.mutateAsync(tipoSolicitudInterno, tipoPersonaInterno, info.id);

            onClose(); // Cerrar modal principal después de aprobar
        } catch (error) {
            console.error(' Error al completar solicitud:', error);
        }
    };

    // Función para manejar rechazo usando hooks unificados
    const handleRechazar = async () => {
        setShowRechazarDialog(true);
    };

    // Confirmar aprobación y poner en espera (para solicitudes con medidor)
    const handleConfirmAprobar = async () => {
        const tipoSolicitud: TipoSolicitud = mapearTipoSolicitud(info.tipoSolicitud);
        const tipoPersona: TipoPersona = mapearTipoPersona(info.tipo);

        try {
            console.log(` Aprobando y poniendo en espera: ${tipoSolicitud} - ${tipoPersona}`);
            await aprobarYEnEsperaMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
            setShowAprobarDialog(false);
            onClose();
        } catch (error) {
            console.error(' Error al marcar en aprobada y en espera:', error);
            setShowAprobarDialog(false);
        }
    };

    // Confirmar completar (para solicitudes sin medidor)
    const handleConfirmCompletar = async () => {
        const tipoSolicitud: TipoSolicitud = mapearTipoSolicitud(info.tipoSolicitud);
        const tipoPersona: TipoPersona = mapearTipoPersona(info.tipo);

        try {
            console.log(` Completando solicitud ${info.tipoSolicitud} directamente desde Estado 2 (sin medidor)`);
            await completarMutation.mutateAsync(tipoSolicitud, tipoPersona, info.id);
            setShowCompletarDialog(false);
            onClose();
        } catch (error) {
            console.error('Error al completar solicitud:', error);
            setShowCompletarDialog(false);
        }
    };

    // Confirmar rechazo
    const handleConfirmRechazar = async () => {
        try {
            // Mapear los tipos a los valores internos
            const tipoSolicitudInterno: TipoSolicitud = mapearTipoSolicitud(solicitud.tipoSolicitud || info.tipoSolicitud);
            const tipoPersonaInterno: TipoPersona = mapearTipoPersona(info.tipo);

            console.log(`Rechazando solicitud: ${tipoSolicitudInterno} - ${tipoPersonaInterno}`);

            // Usar el hook unificado para rechazar (Cualquier estado → 5) con el motivo
            await rechazarMutation.mutateAsync(tipoSolicitudInterno, tipoPersonaInterno, info.id, motivoRechazo.trim());

            setMotivoRechazo(''); // Limpiar motivo después de usarlo
            setShowRechazarDialog(false);
            onClose(); // Cerrar modal después del éxito
        } catch (error) {
            console.error(' Error al rechazar:', error);
            setShowRechazarDialog(false);
        }
    };


    const isLoading =
        marcarEnRevisionMutation.isPending ||
        aprobarYEnEsperaMutation.isPending ||
        completarMutation.isPending ||
        rechazarMutation.isPending;

    if (!isOpen) return null;

    return (
        <>
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

                                            {/* Mostrar tipo de identificación solo para personas físicas */}
                                            {info.tipo === 'Física' && info.Tipo_Identificacion && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                        Tipo de Identificación
                                                    </label>
                                                    <p className="text-sm text-gray-900">{info.Tipo_Identificacion}</p>
                                                </div>
                                            )}

                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                    {info.tipo === 'Física' ? 'Identificación' : 'Cédula Jurídica'}
                                                </label>
                                                <p className="text-sm text-gray-900">{info.documento}</p>
                                            </div>

                                            {/* Mostrar edad solo para personas físicas */}
                                            {info.tipo === 'Física' && info.Edad && info.Edad !== 'No especificada' && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                        Edad
                                                    </label>
                                                    <p className="text-sm text-gray-900">{info.Edad} años</p>
                                                </div>
                                            )}

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
                            {(info.Numero_Medidor_Actual || info.Motivo_Solicitud || info.Numero_Medidor != null) && (
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-white">Detalles de la Solicitud</h3>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Número de medidor seleccionado por el usuario (sólo Cambio de Medidor) */}
                                            {info.tipoSolicitud === 'Cambio de Medidor' && info.Numero_Medidor != null && (
                                                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                                    <label className="block text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                                                        Número de Medidor Seleccionado
                                                    </label>
                                                    <p className="text-base font-bold text-blue-900">{info.Numero_Medidor}</p>
                                                </div>
                                            )}

                                            {info.Numero_Medidor_Actual && info.Numero_Medidor_Actual !== 'No especificado' && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                                                        Número de Medidor Actual
                                                    </label>
                                                    <p className="text-sm font-medium text-gray-900">{info.Numero_Medidor_Actual}</p>
                                                </div>
                                            )}

                                            {info.Motivo_Solicitud && info.Motivo_Solicitud !== 'No especificado' && (
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

                {/* Modals fuera del contenedor principal para evitar conflictos de portales */}
                {showModalMedidor && (
                    <ModalMedidor
                        isOpen={showModalMedidor}
                        onClose={() => {
                            setShowModalMedidor(false);
                        }}
                        onMedidorAsignado={aprobarSolicitudDespuesDeAsignar}
                        tipoSolicitud={solicitud.tipoSolicitud || (info.tipoSolicitud as any)}
                        afiliado={{
                            tipo: solicitud.tipo,
                            datos: solicitud.datos
                        }}
                    />
                )}

                {/* AlertDialog para aprobar y poner en espera */}
                <AlertDialog open={showAprobarDialog} onOpenChange={setShowAprobarDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Aprobar solicitud y poner en espera?</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Desea aprobar la solicitud de <strong>{info.nombre}</strong> y ponerla en espera?
                                <br /><br />
                                Esta acción cambiará el estado a "Aprobada en Espera" y permitirá la asignación del medidor.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>

                            <AlertDialogAction
                                onClick={handleConfirmAprobar}
                                disabled={aprobarYEnEsperaMutation.isPending}
                            >
                                {aprobarYEnEsperaMutation.isPending ? 'Aprobando...' : 'Aprobar'}
                            </AlertDialogAction>
                            <AlertDialogCancel disabled={aprobarYEnEsperaMutation.isPending}>
                                Cancelar
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* AlertDialog para completar directamente (sin medidor) */}
                <AlertDialog open={showCompletarDialog} onOpenChange={setShowCompletarDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Completar solicitud?</AlertDialogTitle>
                            <AlertDialogDescription>
                                ¿Desea completar la solicitud de <strong>{info.nombre}</strong>?
                                <br /><br />
                                Esta solicitud no requiere asignación de medidor y será marcada como completada directamente.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>

                            <AlertDialogAction
                                onClick={handleConfirmCompletar}
                                disabled={completarMutation.isPending}
                            >
                                {completarMutation.isPending ? 'Completando...' : 'Completar'}
                            </AlertDialogAction>
                            <AlertDialogCancel disabled={completarMutation.isPending}>
                                Cancelar
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* AlertDialog para rechazar */}
                <AlertDialog open={showRechazarDialog} onOpenChange={setShowRechazarDialog}>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600">
                                Rechazar Solicitud
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600 mt-2">
                                Por favor, indique el motivo del rechazo de la solicitud. Este será enviado al solicitante por correo.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* Campo de Motivo */}
                        <div className="space-y-3 my-4">
                            <label className="block text-sm font-semibold text-gray-700">
                                Motivo del Rechazo *
                            </label>
                            <textarea
                                placeholder="Describe el motivo del rechazo (mínimo 10 caracteres)..."
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                                className="w-full min-h-24 resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                    {motivoRechazo.length} / 500 caracteres
                                </span>
                                {motivoRechazo.length < 10 && motivoRechazo.length > 0 && (
                                    <span className="text-red-500">
                                        Mínimo 10 caracteres requeridos
                                    </span>
                                )}
                            </div>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setMotivoRechazo('');
                                    setShowRechazarDialog(false);
                                }}
                                disabled={rechazarMutation.isPending}
                            >
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleConfirmRechazar()}
                                disabled={motivoRechazo.trim().length < 10 || rechazarMutation.isPending}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                            >
                                {rechazarMutation.isPending ? 'Rechazando...' : 'Confirmar Rechazo'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
};

export default ModalSolicitud;