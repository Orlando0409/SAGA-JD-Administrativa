import React, { useState } from 'react';
import { LuX, LuFilter } from 'react-icons/lu';
import type { FilterMedidorModalProps } from '../../types/MedidorTypes';

const FilterMedidorModal: React.FC<FilterMedidorModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState<FilterMedidorModalProps['currentFilters']>(currentFilters);

  const estadosMedidor = [
    { id: 1, nombre: 'No instalado' },
    { id: 2, nombre: 'Instalado' },
    { id: 3, nombre: 'Averiado' }
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearFilters = {
      estado: [],
      conAfiliado: false,
      sinAfiliado: false,
    };
    setFilters(clearFilters);
    onApplyFilters(clearFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 flex items-center justify-end z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <LuFilter className="w-5 h-5" />
            Filtros Avanzados
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Estados
              </span>
              <div className="flex gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      estado: estadosMedidor.map(e => e.id)
                    }));
                  }}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1"
                >
                  Todos
                </button>
                <span className="text-xs text-gray-400">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      estado: []
                    }));
                  }}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-700 font-medium px-2 py-1"
                >
                  Ninguno
                </button>
              </div>
            </div>
            
            {filters.estado && filters.estado.length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-2">
                  Estados seleccionados ({filters.estado.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {filters.estado.map((estadoId) => {
                    const estado = estadosMedidor.find(e => e.id === estadoId);
                    return estado ? (
                      <span
                        key={estadoId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {estado.nombre}
                        <button
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              estado: prev.estado?.filter(id => id !== estadoId) || []
                            }));
                          }}
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          <LuX className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
              {estadosMedidor.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {estadosMedidor.map((estado) => {
                    const isSelected = filters.estado?.includes(estado.id) || false;
                    return (
                      <label
                        key={estado.id}
                        className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 border-l-2 border-l-blue-500' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const currentEstados = filters.estado || [];
                            if (e.target.checked) {
                              setFilters(prev => ({
                                ...prev,
                                estado: [...currentEstados, estado.id]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                estado: currentEstados.filter(id => id !== estado.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className={`text-sm flex-1 ${
                          isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}>
                          {estado.nombre}
                        </span>
                        {isSelected && (
                          <span className="text-blue-600 text-xs">✓</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  <div className="mb-2">📊</div>
                  No hay estados disponibles
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Asignación de Afiliado
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.conAfiliado || false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    conAfiliado: e.target.checked,
                    sinAfiliado: e.target.checked ? false : prev.sinAfiliado
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo medidores con afiliado asignado</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.sinAfiliado || false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sinAfiliado: e.target.checked,
                    conAfiliado: e.target.checked ? false : prev.conAfiliado
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo medidores sin afiliado asignado</span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 sm:p-6 z-10">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleClear}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={handleApply}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterMedidorModal;