import React from 'react';
import type { DescripcionFieldProps } from '../../../types/MovimientoTypes';

const DescripcionField: React.FC<DescripcionFieldProps> = ({
  descripcion,
  onDescripcionChange
}) => (
  <div>
    <label htmlFor="descripcion-textarea" className="block text-sm font-medium text-gray-700 mb-3">
      Descripción del Movimiento
    </label>
    <textarea
      id="descripcion-textarea"
      value={descripcion}
      onChange={(e) => onDescripcionChange(e.target.value)}
      placeholder="Describe el motivo o detalles del movimiento..."
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
    />
  </div>
);

export default DescripcionField;