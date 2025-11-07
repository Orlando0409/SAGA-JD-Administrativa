import { useState, useEffect } from 'react';
import { LuX, LuSearch, LuPlus } from 'react-icons/lu';
import type { SolicitudFisica } from '../Models/ModelosFisicas';
import type { SolicitudJuridica } from '../Models/ModelosJuridicos';
import CreateMedidorModal from '@/Modules/Inventario/components/Medidores/CreateMedidorModal';
import { useQuery } from '@tanstack/react-query';
import { getMedidoresNoInstalados } from '@/Modules/Inventario/service/MedidorServices';
import { useAsignarMedidor } from '../Hooks/HookAfiliadoMedidor';

interface ModalMedidorProps {
    isOpen: boolean;
    onClose: () => void;
    onMedidorAsignado?: () => void; // Callback para ejecutar después de asignar medidor
    afiliado: {
        tipo: 'solicitud-fisica' | 'solicitud-juridica';
        datos: SolicitudFisica | SolicitudJuridica;
    };
}

interface Medidor {
    Id_Medidor: number;
    Numero_Medidor: number;
    Estado_Medidor?: any;
    Fecha_Creacion?: string | Date;
}

const ModalMedidor = ({ isOpen, onClose, onMedidorAsignado, afiliado }: ModalMedidorProps) => {
    const asignarMedidorMutation = useAsignarMedidor();

    // Hook para obtener solo medidores NO instalados
    const { data: medidores, isLoading: loadingMedidores, refetch } = useQuery({
        queryKey: ['medidores-no-instalados'],
        queryFn: getMedidoresNoInstalados,
        enabled: isOpen, // Solo cargar cuando el modal está abierto
    });

    const [busquedaMedidor, setBusquedaMedidor] = useState('');
    const [medidorSeleccionado, setMedidorSeleccionado] = useState<Medidor | null>(null);
    const [showCreateMedidor, setShowCreateMedidor] = useState(false);

    // Resetear selección cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setMedidorSeleccionado(null);
            setBusquedaMedidor('');
        }
    }, [isOpen]);

    // Obtener información del afiliado
    const getAfiliadoInfo = () => {
        if (afiliado.tipo === 'solicitud-fisica') {
            const datos = afiliado.datos as any;
            return {
                nombre: `${datos.Nombre || ''} ${datos.Apellido1 || ''} ${datos.Apellido2 || ''}`.trim(),
                documento: datos.Identificacion || datos.Cedula || 'Sin cédula',
                telefono: datos.Numero_Telefono || 'No especificado',
                tipo: 'Persona Física',
                Id_Afiliado: datos.Id_Solicitud || datos.id
            };
        } else {
            const datos = afiliado.datos as any;
            return {
                nombre: datos.Razon_Social || 'Sin razón social',
                documento: datos.Cedula_Juridica || 'Sin cédula jurídica',
                telefono: datos.Numero_Telefono || 'No especificado',
                tipo: 'Persona Jurídica',
                Id_Afiliado: datos.Id_Solicitud || datos.id
            };
        }
    };

    const afiliadoInfo = getAfiliadoInfo();

    // Filtrar medidores disponibles
    const medidoresFiltrados = (medidores || []).filter((medidor: Medidor) => {
        const numero = medidor.Numero_Medidor?.toString() || '';
        const busqueda = busquedaMedidor.toLowerCase();
        return numero.includes(busqueda);
    });

    // Asignar medidor
    const handleAsignarMedidor = async () => {
        if (!medidorSeleccionado) {
            alert('Por favor seleccione un medidor');
            return;
        }

        if (confirm(`¿Desea asignar el medidor ${medidorSeleccionado.Numero_Medidor} a ${afiliadoInfo.nombre}?`)) {
            try {
                await asignarMedidorMutation.mutateAsync({
                    Id_Medidor: medidorSeleccionado.Id_Medidor,
                    Id_Tipo_Entidad: afiliado.tipo === 'solicitud-fisica' ? 1 : 2,
                    Id_Solicitud: afiliadoInfo.Id_Afiliado
                });
                alert('✅ Medidor asignado correctamente');
                onClose();

                // Ejecutar callback para aprobar la solicitud después de asignar
                if (onMedidorAsignado) {
                    await onMedidorAsignado();
                }
            } catch (error) {
                console.error('Error al asignar medidor:', error);
                alert('❌ Error al asignar medidor');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Asignar Medidor
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <LuX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 max-h-[calc(90vh-180px)]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Columna Izquierda - Información del Afiliado */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Información del Afiliado
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                                            <label className="text-xs font-medium text-gray-500 block mb-1">
                                                Nombre Completo / Razón Social
                                            </label>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {afiliadoInfo.nombre}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                                            <label className="text-xs font-medium text-gray-500 block mb-1">
                                                Número de Identificación
                                            </label>
                                            <p className="text-sm font-mono font-semibold text-gray-900">
                                                {afiliadoInfo.documento}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                                            <label className="text-xs font-medium text-gray-500 block mb-1">
                                                Número de Teléfono
                                            </label>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {afiliadoInfo.telefono}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                                            <label className="text-xs font-medium text-gray-500 block mb-1">
                                                Tipo de Persona
                                            </label>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {afiliadoInfo.tipo}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Medidor Seleccionado */}
                                {medidorSeleccionado && (
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Medidor Seleccionado
                                        </h3>

                                        <div className="bg-white rounded-lg p-4 border border-green-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 block mb-1">
                                                        Número de Medidor
                                                    </label>
                                                    <p className="text-2xl font-bold text-green-700">
                                                        {medidorSeleccionado.Numero_Medidor}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setMedidorSeleccionado(null)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Deseleccionar"
                                                >
                                                    <LuX className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Columna Derecha - Selector de Medidores */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Buscar Medidor
                                        </h3>
                                        <button
                                            onClick={() => setShowCreateMedidor(true)}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <LuPlus className="w-4 h-4" />
                                            Nuevo Medidor
                                        </button>
                                    </div>

                                    {/* Buscador */}
                                    <div className="relative mb-4">
                                        <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={busquedaMedidor}
                                            onChange={(e) => setBusquedaMedidor(e.target.value)}
                                            placeholder="Buscar por número de medidor..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>

                                    {/* Lista de Medidores */}
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                        {loadingMedidores ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-sm text-gray-500">Cargando medidores...</p>
                                            </div>
                                        ) : medidoresFiltrados.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-sm text-gray-500">
                                                    {busquedaMedidor ? 'No se encontraron medidores' : 'No hay medidores disponibles'}
                                                </p>
                                            </div>
                                        ) : (
                                            medidoresFiltrados.map((medidor: Medidor) => (
                                                <button
                                                    key={medidor.Id_Medidor}
                                                    onClick={() => setMedidorSeleccionado(medidor)}
                                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${medidorSeleccionado?.Id_Medidor === medidor.Id_Medidor
                                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-mono text-lg font-bold text-gray-900">
                                                                {medidor.Numero_Medidor}
                                                            </p>
                                                            {medidor.Estado_Medidor && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Estado: {medidor.Estado_Medidor?.Nombre_Estado_Medidor || 'No especificado'}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {medidorSeleccionado?.Id_Medidor === medidor.Id_Medidor && (
                                                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer con botones */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAsignarMedidor}
                            disabled={!medidorSeleccionado || asignarMedidorMutation.isPending}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {asignarMedidorMutation.isPending ? 'Asignando...' : 'Asignar Medidor'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para crear medidor */}
            {showCreateMedidor && (
                <CreateMedidorModal
                    isOpen={showCreateMedidor}
                    onClose={() => {
                        setShowCreateMedidor(false);
                        refetch(); // Recargar lista de medidores después de crear uno nuevo
                    }}
                />
            )}
        </>
    );
};

export default ModalMedidor;
