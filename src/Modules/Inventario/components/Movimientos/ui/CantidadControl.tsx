import React from 'react';
import { LuPlus, LuMinus } from 'react-icons/lu';
import type { CantidadControlProps } from '../../../types/MovimientoTypes';

const CantidadControl: React.FC<CantidadControlProps> = ({
  cantidad,
  selectedMaterial,
  onCantidadChange,
  onDirectCantidadChange
}) => (
  <div>
    <label htmlFor="cantidad-input" className="block text-sm font-medium text-gray-700 mb-3">
      Cantidad {selectedMaterial && `(${selectedMaterial.Unidad_Medicion.Abreviatura})`}
    </label>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onCantidadChange(-1)}
        disabled={cantidad <= 1}
        className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LuMinus className="w-5 h-5" />
      </button>
      <input
        id="cantidad-input"
        type="number"
        min="1"
        value={cantidad}
        onChange={(e) => onDirectCantidadChange(parseInt(e.target.value) || 1)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
      />
      <button
        onClick={() => onCantidadChange(1)}
        className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50"
      >
        <LuPlus className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default CantidadControl;