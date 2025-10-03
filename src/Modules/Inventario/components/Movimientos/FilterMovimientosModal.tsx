import React, { useState, useEffect } from 'react';
import { LuCalendar, LuPackage, LuUser, LuFilter } from 'react-icons/lu';
import type { MovimientoFilterOptions } from '../../types/MovimientosTypes';
import type { TipoMovimiento } from '../../models/MovimientoMaterial';

interface FilterMovimientosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: MovimientoFilterOptions) => void;
  currentFilters: MovimientoFilterOptions;
}

const FilterMovimientosModal: React.FC<FilterMovimientosModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<MovimientoFilterOptions>(currentFilters);

  useEffect(() => {
    if (isOpen) {
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: MovimientoFilterOptions = {};
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    onClose();
  };

  const handleTipoMovimientoChange = (tipo: TipoMovimiento | 'todos') => {
    if (tipo === 'todos') {
      setFilters(prev => ({
        ...prev,
        tipoMovimiento: undefined,
        soloIngresos: false,
        soloEgresos: false
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        tipoMovimiento: tipo,
        soloIngresos: tipo === 'INGRESO',
        soloEgresos: tipo === 'EGRESO'
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <LuFilter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Filtrar Movimientos</h2>
              <p className="text-sm text-gray-600">Refina tu búsqueda de movimientos</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LuCalendar className="w-4 h-4" />
              Rango de Fechas
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  value={filters.fechaInicio || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={filters.fechaFin || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LuPackage className="w-4 h-4" />
              Tipo de Movimiento
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tipoMovimiento"
                  checked={!filters.tipoMovimiento}
                  onChange={() => handleTipoMovimientoChange('todos')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Todos los movimientos</span>
              </label>

              <label aria-label='Tipo de Movimiento: Ingreso' className="flex items-center">
                <input
                  type="radio"
                  name="tipoMovimiento"
                  checked={filters.tipoMovimiento === 'INGRESO'}
                  onChange={() => handleTipoMovimientoChange('INGRESO')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Solo Ingresos</span>
                </span>
              </label>

              <label aria-label='Tipo de Movimiento: Egreso' className="flex items-center">
                <input
                  type="radio"
                  name="tipoMovimiento"
                  checked={filters.tipoMovimiento === 'EGRESO'}
                  onChange={() => handleTipoMovimientoChange('EGRESO')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Solo Egresos</span>
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LuPackage className="w-4 h-4" />
              Filtrar por Material
            </div>
            
            <input
              type="text"
              placeholder="Nombre del material..."
              value={filters.materialNombre || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, materialNombre: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <LuUser className="w-4 h-4" />
              Filtrar por Usuario
            </div>
            
            <input
              type="text"
              placeholder="Nombre del usuario..."
              value={filters.usuario || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, usuario: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Rango de Cantidad
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="cantidadMinima" className="block text-sm text-gray-600 mb-1">
                  Cantidad Mínima
                </label>
                <input
                  type="number"
                  id="cantidadMinima"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={filters.cantidadMinima || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    cantidadMinima: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="cantidadMaxima" className="block text-sm text-gray-600 mb-1">
                  Cantidad Máxima
                </label>
                <input
                  type="number"
                  id="cantidadMaxima"
                  min="0"
                  step="1"
                  placeholder="∞"
                  value={filters.cantidadMaxima || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    cantidadMaxima: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Limpiar Filtros
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterMovimientosModal;