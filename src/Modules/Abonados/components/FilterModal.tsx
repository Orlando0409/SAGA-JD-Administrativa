import React, { useState } from 'react';
import { LuX, LuFilter } from 'react-icons/lu';

export interface FilterOptions {
    estado: 'activo' | 'inactivo' | 'pendiente' | '';
    tipoPersona: 'Físico' | 'Jurídico' | '';
    tipoAfiliado: 'Abonado' | 'Asociado' | '';
    busquedaAvanzada: string;
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
    const [filters, setFilters] = useState<FilterOptions>(currentFilters);

    const handleApply = () => {
        onApplyFilters(filters);
        onClose();
    };



    
    const handleClear = () => {
        const clearFilters: FilterOptions = {
            estado: '',
            tipoPersona: '',
            tipoAfiliado: '',
            busquedaAvanzada: ''
        };
        setFilters(clearFilters);
        onApplyFilters(clearFilters);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur flex items-start justify-end z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <LuFilter className="w-5 h-5" />
                        Filtros Avanzados
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <LuX className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">

                    {/* Filtro por Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estado
                        </label>
                        <select
                            value={filters.estado || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' | 'pendiente' | '' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los estados</option>
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>

                    {/* Filtro por Tipo de Persona */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Persona
                        </label>
                        <select
                            value={filters.tipoPersona || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, tipoPersona: e.target.value as 'Físico' | 'Jurídico' | '' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="Físico">Persona Física</option>
                            <option value="Jurídico">Persona Jurídica</option>
                        </select>
                    </div>

                    {/* Filtro por Tipo de Afiliado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Afiliado
                        </label>
                        <select
                            value={filters.tipoAfiliado || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, tipoAfiliado: e.target.value as 'Abonado' | 'Asociado' | '' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Todos los afiliados</option>
                            <option value="Abonado">Abonado</option>
                            <option value="Asociado">Asociado</option>
                        </select>
                    </div>

                    {/* Búsqueda Avanzada */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Búsqueda Avanzada
                        </label>
                        <input
                            type="text"
                            value={filters.busquedaAvanzada}
                            onChange={(e) => setFilters(prev => ({ ...prev, busquedaAvanzada: e.target.value }))}
                            placeholder="Buscar por nombre, cédula, correo..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Busca en: Nombre completo, Cédula, Correo electrónico
                        </p>
                    </div>

                    {/* Información de filtros activos */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Filtros Activos:</h4>
                        <div className="space-y-1 text-xs text-blue-700">
                            {filters.estado && (
                                <div>• Estado: <span className="font-medium">{filters.estado}</span></div>
                            )}
                            {filters.tipoPersona && (
                                <div>• Tipo Persona: <span className="font-medium">{filters.tipoPersona}</span></div>
                            )}
                            {filters.tipoAfiliado && (
                                <div>• Tipo Afiliado: <span className="font-medium">{filters.tipoAfiliado}</span></div>
                            )}
                            {filters.busquedaAvanzada && (
                                <div>• Búsqueda: <span className="font-medium">"{filters.busquedaAvanzada}"</span></div>
                            )}
                            {!filters.estado && !filters.tipoPersona && !filters.tipoAfiliado && !filters.busquedaAvanzada && (
                                <div className="text-gray-500">Sin filtros aplicados</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClear}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                         Limpiar Todo
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                         Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
