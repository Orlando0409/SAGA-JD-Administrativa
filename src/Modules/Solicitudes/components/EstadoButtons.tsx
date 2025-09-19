import React from 'react';
import {

    useAprobarSolicitudAfiliacion,
    useMutateEstadoSolicitud,
    useRechazarSolicitudAfiliacion
} from '../Hooks/Fisico Update/HookAfiliadoFisico';
import { useAprobarSolicitudCambioMedidor, useRechazarSolicitudCambioMedidor } from '../Hooks/Fisico Update/HookCambioMedidorFisico';
import { useAprobarSolicitudAsociado, useRechazarSolicitudAsociado } from '../Hooks/Fisico Update/HookAsociadoFisico';
import { useAprobarSolicitudDesconexion, useRechazarSolicitudDesconexion } from '../Hooks/Fisico Update/HookDesconexionMedidorFisico';
import { useAprobarSolicitudAfiliacionJuridica, useRechazarSolicitudAfiliacionJuridica } from '../Hooks/Juridico Update/HookAfiliadoJuridico';
import { useAprobarSolicitudAsociadoJuridico, useRechazarSolicitudAsociadoJuridico } from '../Hooks/Juridico Update/HookAsociadoJuridico';
import { useAprobarSolicitudCambioMedidorJuridica, useRechazarSolicitudCambioMedidorJuridica } from '../Hooks/Juridico Update/HookCambioMedidorJuridico';
import { useAprobarSolicitudDesconexionJuridica, useRechazarSolicitudDesconexionJuridica } from '../Hooks/Juridico Update/HookDesconexionMedidor';

interface EstadoButtonsProps {
    solicitudId: string | number;
    estadoActual?: string;
    tipoSolicitud: 'Afiliacion' | 'Cambio_Medidor' | 'Asociado' | 'Desconexion'; // Tipo de solicitud requerido
    tipoPersona: 'solicitud-fisica' | 'solicitud-juridica'; // Nuevo campo para identificar si es física o jurídica
    onEstadoChanged?: (nuevoEstado: string) => void;
}

/**
 * 🎛️ Componente de botones para cambiar estados de solicitudes
 * Ejemplo de uso de los hooks de mutación
 */
const EstadoButtons: React.FC<EstadoButtonsProps> = ({
    solicitudId,
    estadoActual,
    tipoSolicitud, // Nueva prop para identificar el tipo
    tipoPersona, // Nueva prop para identificar si es física o jurídica
    onEstadoChanged
}) => {
    // Hooks de mutación específicos
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
    // Hook genérico para cualquier estado
    const updateEstadoMutation = useMutateEstadoSolicitud();

    // Handle para aprobar según el tipo de solicitud
    const handleAprobar = async () => {
        if (confirm('¿Está seguro de aprobar esta solicitud?')) {
            try {
                console.log(`🎯 Aprobando solicitud: Tipo Persona: ${tipoPersona}, Tipo Solicitud: ${tipoSolicitud}`);

                // Determinar qué mutación usar basado en tipo de persona y tipo de solicitud
                if (tipoPersona === 'solicitud-fisica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await aprobarAfiliacionMutation.mutateAsync(solicitudId);
                            break;
                        case 'Cambio_Medidor':
                            await aprobarCambioMedidorMutation.mutateAsync(solicitudId);
                            break;
                        case 'Asociado':
                            await aprobarAsociadoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Desconexion':
                            await aprobarDesconexionMutation.mutateAsync(solicitudId);
                            break;
                        default:
                            console.warn('⚠️ Tipo de solicitud física no reconocido:', tipoSolicitud);
                            await aprobarAfiliacionMutation.mutateAsync(solicitudId);
                    }
                } else if (tipoPersona === 'solicitud-juridica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await aprobarAfiliacionJuridicaMutation.mutateAsync(solicitudId);
                            break;
                        case 'Cambio_Medidor':
                            await aprobarCambioMedidorJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Asociado':
                            await aprobarAsociadoJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Desconexion':
                            await aprobarDesconexionJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        default:
                            console.warn(' Tipo de solicitud jurídica no reconocido:', tipoSolicitud);
                            await aprobarAfiliacionJuridicaMutation.mutateAsync(solicitudId);
                    }
                } else {
                    console.error(' Tipo de persona no reconocido:', tipoPersona);
                    throw new Error('Tipo de solicitud no válido');
                }

                onEstadoChanged?.('Aprobada');
                alert(' Solicitud aprobada exitosamente');
            } catch (error) {
                console.error(' Error al aprobar solicitud:', error);
                alert(' Error al aprobar la solicitud');
            }
        }
    };

    // Handle para rechazar según el tipo de solicitud
    const handleRechazar = async () => {
        if (confirm('¿Está seguro de rechazar esta solicitud?')) {
            try {
                console.log(` Rechazando solicitud: Tipo Persona: ${tipoPersona}, Tipo Solicitud: ${tipoSolicitud}`);

                // Determinar qué mutación usar basado en tipo de persona y tipo de solicitud
                if (tipoPersona === 'solicitud-fisica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await rechazarAfiliacionMutation.mutateAsync(solicitudId);
                            break;
                        case 'Cambio_Medidor':
                            await rechazarCambioMedidorMutation.mutateAsync(solicitudId);
                            break;
                        case 'Asociado':
                            await rechazarAsociadoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Desconexion':
                            await rechazarDesconexionMutation.mutateAsync(solicitudId);
                            break;
                        default:
                            console.warn(' Tipo de solicitud física no reconocido:', tipoSolicitud);
                            await rechazarAfiliacionMutation.mutateAsync(solicitudId);
                    }
                } else if (tipoPersona === 'solicitud-juridica') {
                    switch (tipoSolicitud) {
                        case 'Afiliacion':
                            await rechazarAfiliacionJuridicaMutation.mutateAsync(solicitudId);
                            break;
                        case 'Cambio_Medidor':
                            await rechazarCambioMedidorJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Asociado':
                            await rechazarAsociadoJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        case 'Desconexion':
                            await rechazarDesconexionJuridicoMutation.mutateAsync(solicitudId);
                            break;
                        default:
                            console.warn(' Tipo de solicitud jurídica no reconocido:', tipoSolicitud);
                            await rechazarAfiliacionJuridicaMutation.mutateAsync(solicitudId);
                    }
                } else {
                    console.error(' Tipo de persona no reconocido:', tipoPersona);
                    throw new Error('Tipo de solicitud no válido');
                }

                onEstadoChanged?.('Rechazada');
                alert(' Solicitud rechazada');
            } catch (error) {
                console.error(' Error al rechazar solicitud:', error);
                alert(' Error al rechazar la solicitud');
            }
        }
    };

    // Función genérica para cambiar a cualquier estado
    const handleCambiarEstado = async (nuevoEstadoId: number, nombreEstado: string) => {
        try {
            await updateEstadoMutation.mutateAsync({
                solicitudId,
                nuevoEstadoId
            });
            onEstadoChanged?.(nombreEstado);
            alert(` Estado cambiado a: ${nombreEstado}`);
        } catch (error) {
            alert(' Error al cambiar estado');
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
        aprobarDesconexionJuridicoMutation.isPending || rechazarDesconexionJuridicoMutation.isPending ||
        // Mutación genérica
        updateEstadoMutation.isPending;

    return (
        <div className="flex flex-wrap gap-2">
            {/* Botones de acciones específicas */}
            <button
                onClick={handleAprobar}
                disabled={isLoading || estadoActual === 'Aprobada'}
                className="px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-green-200"
            >
                {isLoading ? 'Procesando' : 'Aprobar'} 
            </button>

            <button
                onClick={handleRechazar}
                disabled={isLoading || estadoActual === 'Rechazada'}
                className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-red-200"
            >
                {isLoading ? 'Procesando' : 'Rechazar'}
            </button>

            {/* Ejemplo de botón con estado personalizado */}
            <button
                onClick={() => handleCambiarEstado(5, 'Completada')}
                disabled={isLoading || estadoActual === 'Completada'}
                className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-purple-200"
            >
                {updateEstadoMutation.isPending ? 'Procesando' : 'Completar'}
            </button>
        </div>
    );
};

export default EstadoButtons;