import React from 'react';
import { LuX } from 'react-icons/lu';
import type { MovimientoMaterial } from '../../models/MovimientoMaterial';

interface DetailMovimientoModalProps {
  movimiento: MovimientoMaterial;
  isOpen: boolean;
  onClose: () => void;
}

const DetailMovimientoModal: React.FC<DetailMovimientoModalProps> = ({
  movimiento,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const isIngreso = movimiento.Tipo_Movimiento === 'INGRESO';
  const fechaMovimiento = new Date(movimiento.Fecha_Movimiento);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalle del Movimiento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Tipo de Movimiento</div>
              <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                isIngreso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {movimiento.Tipo_Movimiento}
              </span>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Material</div>
              <p className="text-lg font-semibold text-gray-900">
                {movimiento.Material?.Nombre_Material || 'Material no disponible'}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Cantidad</div>
              <p className="text-lg font-semibold text-gray-900">
                {movimiento.Cantidad} {movimiento.Material?.Unidad_Medicion?.Nombre_Unidad}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">Fecha</div>
              <p className="text-sm text-gray-600">
                {fechaMovimiento.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {movimiento.Motivo && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Motivo</div>
                <p className="text-gray-700">{movimiento.Motivo}</p>
              </div>
            )}

            {movimiento.Usuario && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Usuario</div>
                <p className="text-gray-700">{movimiento.Usuario}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Cantidad Anterior</div>
                <p className="text-sm text-gray-600">
                  {movimiento.Cantidad_Anterior} {movimiento.Material?.Unidad_Medicion?.Nombre_Unidad}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Cantidad Movimiento</div>
                <p className={`text-sm font-semibold ${
                  isIngreso ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isIngreso ? '+' : '-'}{movimiento.Cantidad} {movimiento.Material?.Unidad_Medicion?.Nombre_Unidad}
                </p>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Cantidad Nueva</div>
                <p className="text-sm text-gray-600">
                  {movimiento.Cantidad_Nueva} {movimiento.Material?.Unidad_Medicion?.Nombre_Unidad}
                </p>
              </div>
            </div>

            {movimiento.Observaciones && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Observaciones</div>
                <p className="text-gray-700">{movimiento.Observaciones}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMovimientoModal;