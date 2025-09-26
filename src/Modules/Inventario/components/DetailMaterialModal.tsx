import React, { useState } from 'react';
import { LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useDeleteMaterial } from '../hooks/InventarioHook';
import type { Material } from '../models/Inventario';
import EditMaterialModal from './EditMaterialModal';

interface DetailMaterialModalProps {
  material: Material;
  isOpen: boolean;
  onClose: () => void;
}

const DetailMaterialModal: React.FC<DetailMaterialModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  const deleteMaterialMutation = useDeleteMaterial();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el material "${material.Nombre_Material}"?`)) {
      setIsDeleting(true);
      try {
        await deleteMaterialMutation.mutateAsync(material.Id_Material);
        onClose();
      } catch (error) {
        console.error('Error al eliminar material:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles del Material
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Material
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Nombre_Material}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Descripcion || 'Sin descripción'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categorías
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Categorias && material.Categorias.length > 0
                  ? material.Categorias.map(cat => cat.Nombre_Categoria_Material).join(', ')
                  : 'Sin categorías'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Estado_Material?.Nombre_Estado_Material || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad en Stock
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Cantidad} unidades
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                ₡{material.Precio_Unitario?.toLocaleString() || '0'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {new Date(material.Fecha_Entrada).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Actualización
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {new Date(material.Fecha_Actualizacion).toLocaleDateString()}
              </p>
            </div>

            {material.Fecha_Salida && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Salida
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                  {new Date(material.Fecha_Salida).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>


        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <LuPencil size={16} />
            Editar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <LuTrash2 size={16} />
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {/* Edit Material Modal */}
      {showEditModal && (
        <EditMaterialModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          material={material}
        />
      )}
    </div>
  );
};

export default DetailMaterialModal;
