import React, { useState } from 'react';
import { 
  LuPlus, 
  LuSearch, 
  LuArrowLeft
} from 'react-icons/lu';

import CreateMovimientoModal from './CreateMovimientoModal';

interface MovimientosManagementProps {
  onBack?: () => void;
}

const MovimientosManagement: React.FC<MovimientosManagementProps> = ({ onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Versión ULTRA simplificada para evitar renderizado infinito
  console.log('MovimientosManagement rendering - version simple');

  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      {onBack && (
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">
            Movimientos de Inventario
          </h1>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar movimientos..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <LuPlus className="w-4 h-4" />
            Nuevo Movimiento
          </button>
        </div>
      </div>

      {/* Contenido simplificado */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Catálogo de Movimientos - Versión Simplificada
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Búsqueda: "{globalFilter || 'Sin filtro'}"
            </p>
            <p className="text-sm text-gray-400">
              Esta es la versión simplificada para evitar renderizado infinito
            </p>
          </div>
        </div>
      </div>

      {/* Modal de creación */}
      <CreateMovimientoModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default MovimientosManagement;