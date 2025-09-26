import React, { useState } from 'react';
import { LuX, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useDeleteCategoriaMaterial } from '../hooks/InventarioHook';
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
  const deleteMaterialMutation = useDeleteCategoriaMaterial();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
      setIsDeleting(true);
      try {
        await deleteMaterialMutation.mutateAsync({
          idMaterial: material.Id_Material,
          idCategoria: material.Categorias?.[0]?.Id_Categoria ?? 0
        });
        onClose();
      } catch (error) {
        console.log('Error al eliminar la categoría del material:', error);
      } finally {
        setIsDeleting(false);
      }
  }

  const handleEdit = () => {
    setShowEditModal(true);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Material
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border break-words overflow-wrap-anywhere">
                {material.Nombre_Material}
              </p>
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border break-words overflow-wrap-anywhere">
                {material.Descripcion || 'Sin descripción'}
              </p>
            </div>

            <div>
              <label htmlFor="categorias" className="block text-sm font-medium text-gray-700 mb-1">
                Categorías
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border break-words overflow-wrap-anywhere">
                {material.Categorias && material.Categorias.length > 0
                  ? material.Categorias.map(cat => (
                    <li key={cat.Id_Categoria} className="list-disc list-inside">
                      {cat.Nombre_Categoria}
                    </li>
                  ))
                  : 'Sin categorías'}
              </p>
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {material.Estado_Material?.Nombre_Estado_Material || 'N/A'}
              </p>
            </div>

            <div>
              <label htmlFor="cantidad-stock" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad en Stock
              </label>
              <p id="cantidad-stock" className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
              {material.Cantidad} unidades
              </p>
            </div>

            <div>
              <label htmlFor="precio-unitario" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario
              </label>
              <p id="precio-unitario" className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                ₡{material.Precio_Unitario?.toLocaleString() || '0'}
              </p>
            </div>

            <div>
              <label htmlFor="fecha-entrada" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {new Date(material.Fecha_Entrada).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label htmlFor="fecha-actualizacion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Actualización
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                {new Date(material.Fecha_Actualizacion).toLocaleDateString()}
              </p>
            </div>

            {material.Fecha_Salida && (
              <div>
                <label htmlFor="fecha-salida" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Salida
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                  {new Date(material.Fecha_Salida).toLocaleDateString()}
                </p>
              </div>
            )}

            {material.Fecha_Baja && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Baja
                </span>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                  {new Date(material.Fecha_Baja).toLocaleDateString()}
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
            {isDeleting ? 'Eliminando...' : 'Eliminar Categoría'}
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditMaterialModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          material={material}
        />
      )}
    </div>
  )
}

export default DetailMaterialModal
