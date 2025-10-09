// src/Modules/QuejasSugerenciasReportes/components/CreateContactoModal.tsx
import { useState } from 'react';
import { LuX } from 'react-icons/lu';
import type { TipoContacto } from '../types/ContactoTypes';
import FormularioQueja from './FormularioQueja';
import FormularioSugerencia from './FormularioSugerencia';
import FormularioReporte from './FormularioReporte';

interface CreateContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateContactoModal = ({ isOpen, onClose }: CreateContactoModalProps) => {
  const [selectedTipo, setSelectedTipo] = useState<TipoContacto>('Queja');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Crear nuevo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {/* Selector de tipo */}
          <div className="mb-4">
            <label htmlFor="tipo-select" className="block mb-2 text-sm font-medium text-gray-700">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo-select"
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value as TipoContacto)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Queja">Queja</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Reporte">Reporte</option>
            </select>
          </div>

          {/* Formularios */}
          {selectedTipo === 'Queja' && <FormularioQueja />}
          {selectedTipo === 'Sugerencia' && <FormularioSugerencia />}
          {selectedTipo === 'Reporte' && <FormularioReporte />}
        </div>
      </div>
    </div>
  );
};

export default CreateContactoModal;
