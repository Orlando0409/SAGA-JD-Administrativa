import React from 'react';
import type { UnidadMedicion } from '../../models/Inventario';

interface DetailUnidadMedicionModalProps {
  isOpen: boolean;
  onClose: () => void;
  unidad: UnidadMedicion;
}

const DetailUnidadMedicionModal: React.FC<DetailUnidadMedicionModalProps> = ({ isOpen, onClose, unidad }) => {
  
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

       const estado = unidad.Estado_Unidad_Medicion?.Nombre_Estado_Unidad_Medicion || 'Activo';
       const isActiva = estado === 'Activo';
       const colorClass = isActiva 
         ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
         : 'bg-slate-200 text-slate-700 border border-slate-400';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles de Unidad de Medición
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </div>
              <p className="text-sm text-gray-900">
                {unidad.Nombre_Unidad_Medicion || unidad.Nombre_Unidad}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Abreviatura
              </div>
              <p className="text-sm text-gray-900">
                {unidad.Abreviatura}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </div>
               <p className='text-sm text-gray-900'>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                  {estado}
                </span>
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </div>
              <p className="text-sm text-gray-900">
                {unidad.Descripcion || 'Sin descripción'}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </div>
              <p className="text-sm text-gray-900">
                {formatDate(unidad.Fecha_Creacion)}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Última Actualización
              </div>
              <p className="text-sm text-gray-900">
                {formatDate(unidad.Fecha_Actualizacion)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUnidadMedicionModal;
