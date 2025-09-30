import React from 'react';
import { LuX } from 'react-icons/lu';
import type { CategoriaMaterial } from '../../models/Inventario';

interface DetailCategoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: CategoriaMaterial;
}

const DetailCategoriaModal: React.FC<DetailCategoriaModalProps> = ({ isOpen, onClose, categoria }) => {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles de Categoría
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LuX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
              <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría
              </div>
              <p className="w-full text-sm text-gray-900 bg-gray-50 p-2 rounded border break-words overflow-wrap-anywhere">
                {categoria.Nombre_Categoria}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">Estado</div>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border break-words overflow-wrap-anywhere">
                Activa
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCategoriaModal;