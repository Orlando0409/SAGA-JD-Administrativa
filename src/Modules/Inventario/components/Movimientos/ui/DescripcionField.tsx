import React from 'react';
import type { DescripcionFieldProps } from '../../../types/MovimientoTypes';
import { OBSERVACIONES_MAX_LENGTH } from '../../../types/MovimientoTypes';

const DescripcionField: React.FC<DescripcionFieldProps> = ({
  descripcion,
  onDescripcionChange
}) => {
  const handleChange = (value: string) => {
    if (value.length <= OBSERVACIONES_MAX_LENGTH) {
      onDescripcionChange(value);
    }
  };

  const remaining = OBSERVACIONES_MAX_LENGTH - descripcion.length;
  const isNearLimit = remaining <= 25;

  return (
    <div>
      <label htmlFor="descripcion-textarea" className="block text-sm font-medium text-gray-700 mb-3">
        Descripción del Movimiento
      </label>
      <textarea
        id="descripcion-textarea"
        value={descripcion}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Describe el motivo o detalles del movimiento..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
      />
      <div className={`text-right text-xs mt-1 ${
        isNearLimit ? 'text-orange-500 font-medium' : 'text-gray-500'
      }`}>
        {descripcion.length}/{OBSERVACIONES_MAX_LENGTH}
      </div>
    </div>
  );
};

export default DescripcionField;