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

  const estado = categoria.Estado_Categoria?.Nombre_Estado_Categoria || 'Activa';
  const isActiva = estado === 'Activa';
  const colorClass = isActiva 
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
    : 'bg-slate-200 text-slate-700 border border-slate-400';

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
              <p className="text-sm text-gray-900">
                {categoria.Nombre_Categoria}
              </p>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">Estado</div>
              <p className='text-sm text-gray-900'>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
                  {estado}
                </span>
              </p>
            </div>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">Descripción</div>
            <p className="text-sm text-gray-900">
              {categoria.Descripcion_Categoria || 'Sin descripción'}
            </p>
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">Creado por: </div>
            <p className="text-sm text-gray-900">
              {categoria.Usuario_Creador?.Nombre_Usuario || 'Desconocido'}
            </p>
          </div>
        </div>
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
      </div>
    </div>
  );
};

export default DetailCategoriaModal;