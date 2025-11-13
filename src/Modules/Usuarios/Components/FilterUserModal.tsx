import { useRoles } from '@/Modules/Roles/Hooks/RoleHook';
import React, { useState } from 'react';
import { LuX, LuFilter } from 'react-icons/lu';
import type { FilterModalProps, FilterOptions } from '../Types/UserTypes';




const FilterUserModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const { data: roles = [] } = useRoles();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearFilters: FilterOptions = {
      rol: '',
      estado: 'activo', // Por defecto volver a solo activos
    };
    setFilters(clearFilters);
    onApplyFilters(clearFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-end z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
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

        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label htmlFor='rol' className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Rol
            </label>
            <select
              id='rol'
              value={filters.rol || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, rol: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              {roles.map((rol: any) => (
                <option key={rol.Id_Rol} value={rol.Nombre_Rol}>
                  {rol.Nombre_Rol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor='estado' className="block text-sm font-medium text-gray-700 mb-2">
              Estado del Usuario
            </label>
            <select
              id='estado'
              value={filters.estado || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value as 'activo' | 'inactivo' | 'todos' | '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="activo">Solo Activos</option>
              <option value="inactivo">Solo Inactivos</option>
              <option value="todos">Todos los usuarios</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 justify-end bg-gray-50">
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar Todo
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterUserModal;