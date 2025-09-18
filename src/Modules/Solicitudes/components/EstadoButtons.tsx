import React from 'react';
import {
    useAprobarSolicitud,
    useRechazarSolicitud,
    useMutateEstadoSolicitud
} from '../Hooks/HookUpdateEstadoSolicitud';

interface EstadoButtonsProps {
    solicitudId: string | number;
    estadoActual?: string;
    onEstadoChanged?: (nuevoEstado: string) => void;
}

/**
 * 🎛️ Componente de botones para cambiar estados de solicitudes
 * Ejemplo de uso de los hooks de mutación
 */
const EstadoButtons: React.FC<EstadoButtonsProps> = ({
    solicitudId,
    estadoActual,
    onEstadoChanged
}) => {
    // Hooks de mutación específicos
    const aprobarMutation = useAprobarSolicitud();
    const rechazarMutation = useRechazarSolicitud();

    // Hook genérico para cualquier estado
    const updateEstadoMutation = useMutateEstadoSolicitud();

    // Función para manejar aprobación
    const handleAprobar = async () => {
        if (confirm('¿Está seguro de aprobar esta solicitud?')) {
            try {
                await aprobarMutation.mutateAsync(solicitudId);
                onEstadoChanged?.('Aprobada');
                alert('✅ Solicitud aprobada exitosamente');
            } catch (error) {
                alert('❌ Error al aprobar la solicitud');
            }
        }
    };

    // Función para manejar rechazo
    const handleRechazar = async () => {
        if (confirm('¿Está seguro de rechazar esta solicitud?')) {
            try {
                await rechazarMutation.mutateAsync(solicitudId);
                onEstadoChanged?.('Rechazada');
                alert('❌ Solicitud rechazada');
            } catch (error) {
                alert('❌ Error al rechazar la solicitud');
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
            alert(`🔄 Estado cambiado a: ${nombreEstado}`);
        } catch (error) {
            alert('❌ Error al cambiar estado');
        }
    };

    const isLoading =
        aprobarMutation.isPending ||
        rechazarMutation.isPending ||
        updateEstadoMutation.isPending;

    return (
        <div className="flex flex-wrap gap-2">
            {/* Botones de acciones específicas */}
            <button
                onClick={handleAprobar}
                disabled={isLoading || estadoActual === 'Aprobada'}
                className="px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-green-200"
            >
                {aprobarMutation.isPending ? '⏳' : '✅'} Aprobar
            </button>

            <button
                onClick={handleRechazar}
                disabled={isLoading || estadoActual === 'Rechazada'}
                className="px-3 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-red-200"
            >
                {rechazarMutation.isPending ? '⏳' : '❌'} Rechazar
            </button>

            {/* Ejemplo de botón con estado personalizado */}
            <button
                onClick={() => handleCambiarEstado(5, 'Completada')}
                disabled={isLoading || estadoActual === 'Completada'}
                className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-purple-200"
            >
                {updateEstadoMutation.isPending ? '⏳' : '🎯'} Completar
            </button>
        </div>
    );
};

export default EstadoButtons;