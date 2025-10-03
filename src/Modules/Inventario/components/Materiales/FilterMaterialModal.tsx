import React, { useState } from 'react';
import { LuX, LuFilter } from 'react-icons/lu';
import { useGetAllCategories } from '../../hooks/useCategorias';
import type { FilterMaterialModalProps, MaterialFilterOptions } from '../../types/MaterialTypes';



const FilterMaterialModal: React.FC<FilterMaterialModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const { data: categorias = [] } = useGetAllCategories();
  
  const estados = [
    { id: 1, nombre: 'Disponible' },
    { id: 2, nombre: 'Agotado' }
  ];
  
  const [filters, setFilters] = useState<MaterialFilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearFilters: MaterialFilterOptions = {
      categoria: [],
      estado: '',
      conStock: false,
      precioMin: undefined,
      precioMax: undefined,
      soloConCategorias: false,
      soloSinCategorias: false,
      stockMinimo: undefined,
      stockMaximo: undefined,
      tipoFiltroStock: undefined,
    };
    setFilters(clearFilters);
    onApplyFilters(clearFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <section className="fixed inset-0 flex items-start justify-end z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <LuFilter className="w-5 h-5" />
            Filtros Avanzados
          </h2>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Categorías
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      categoria: categorias.map(c => c.Id_Categoria)
                    }));
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Todas
                </button>
                <span className="text-xs text-gray-400">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      categoria: []
                    }));
                  }}
                  className="text-xs text-gray-600 hover:text-gray-700 font-medium"
                >
                  Ninguna
                </button>
              </div>
            </div>
            
            {filters.categoria && filters.categoria.length > 0 && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-2">
                  Categorías seleccionadas ({filters.categoria.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {filters.categoria.map((categoriaId) => {
                    const categoria = categorias.find(c => c.Id_Categoria === categoriaId);
                    return categoria ? (
                      <span
                        key={categoriaId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {categoria.Nombre_Categoria}
                        <button
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              categoria: prev.categoria?.filter(id => id !== categoriaId) || []
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
              {categorias.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {categorias.map((categoria) => {
                    const isSelected = filters.categoria?.includes(categoria.Id_Categoria) || false;
                    return (
                      <label
                        key={categoria.Id_Categoria}
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
                            const currentCategorias = filters.categoria || [];
                            if (e.target.checked) {
                              // Agregar categoría
                              setFilters(prev => ({
                                ...prev,
                                categoria: [...currentCategorias, categoria.Id_Categoria]
                              }));
                            } else {
                              // Remover categoría
                              setFilters(prev => ({
                                ...prev,
                                categoria: currentCategorias.filter(id => id !== categoria.Id_Categoria)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className={`text-sm flex-1 ${
                          isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}>
                          {categoria.Nombre_Categoria}
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
                  <div className="mb-2">📂</div>
                  No hay categorías disponibles
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="filter-estado" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="filter-estado"
              value={filters.estado || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.nombre}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Categorías
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.soloConCategorias || false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    soloConCategorias: e.target.checked,
                    soloSinCategorias: e.target.checked ? false : prev.soloSinCategorias
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo materiales con categorías</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.soloSinCategorias || false}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    soloSinCategorias: e.target.checked,
                    soloConCategorias: e.target.checked ? false : prev.soloConCategorias
                  }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo materiales sin categorías</span>
              </label>
            </div>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Stock
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.conStock || false}
                  onChange={(e) => setFilters(prev => ({ ...prev, conStock: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo materiales con stock disponible</span>
              </label>
              
              <div>
                <label htmlFor="tipo-filtro-stock" className="block text-xs font-medium text-gray-600 mb-1">
                  Tipo de filtro por cantidad
                </label>
                <select
                  id="tipo-filtro-stock"
                  value={filters.tipoFiltroStock || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    tipoFiltroStock: e.target.value as 'encima' | 'debajo' | 'entre' | undefined
                  }))}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sin filtro por cantidad</option>
                  <option value="encima">Por encima de cantidad</option>
                  <option value="debajo">Por debajo de cantidad</option>
                  <option value="entre">Entre cantidades</option>
                </select>
              </div>

              {filters.tipoFiltroStock === 'encima' && (
                <div>
                  <input
                    type="number"
                    placeholder="Cantidad mínima"
                    value={filters.stockMinimo || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      stockMinimo: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              )}

              {filters.tipoFiltroStock === 'debajo' && (
                <div>
                  <input
                    type="number"
                    placeholder="Cantidad máxima"
                    value={filters.stockMaximo || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      stockMaximo: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              )}

              {filters.tipoFiltroStock === 'entre' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Stock mín."
                    value={filters.stockMinimo || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      stockMinimo: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Stock máx."
                    value={filters.stockMaximo || ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      stockMaximo: e.target.value ? Number(e.target.value) : undefined 
                    }))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Precio
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Precio mín."
                  value={filters.precioMin || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    precioMin: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Precio máx."
                  value={filters.precioMax || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    precioMax: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center ">
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aplicar Filtros
            </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Limpiar Filtros
          </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FilterMaterialModal