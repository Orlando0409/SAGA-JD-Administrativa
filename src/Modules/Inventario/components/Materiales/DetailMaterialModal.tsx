import React from 'react';
import { LuX } from 'react-icons/lu';
import type { Material } from '../../models/Inventario';

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

    const estado = material.Estado_Material?.Nombre_Estado_Material || 'N/A';
    let colorClass = '';
    
    if (estado === 'Disponible') {
      colorClass = 'bg-emerald-100 text-emerald-700 border border-emerald-300';
    } else if (estado === 'Agotado') {
      colorClass = 'bg-red-100 text-red-700 border border-red-300';
    } else if (estado === 'De baja') {
      colorClass = 'bg-slate-200 text-slate-700 border border-slate-400';
    } else if (estado === 'Agotado y de baja') {
      colorClass = 'bg-amber-100 text-amber-700 border border-amber-300';
    }

  if (!isOpen) return null;

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
              <p className="text-sm text-gray-900">
                {material.Nombre_Material}
              </p>
            </div>

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900">
                {material.Descripcion || 'Sin descripción'}
              </p>
            </div>

            <div>
              <label htmlFor="categorias" className="block text-sm font-medium text-gray-700 mb-1">
                Categorías
              </label>
              <div className="text-sm text-gray-900">
                {(() => {
                  const categorias = (material.materialCategorias && material.materialCategorias.length > 0) 
                    ? material.materialCategorias 
                    : (material.Categorias || []);
                  
                  return categorias.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {categorias.map(cat => (
                        <li key={cat.Id_Material_Categoria || (cat as any).Id_Categoria}>
                          {cat.Categoria?.Nombre_Categoria || (cat as any).Nombre_Categoria}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>Sin categorías</span>
                  );
                })()}
              </div>
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <p className="text-sm text-gray-900">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
                  {estado}
                </span>
              </p>
            </div>

            <div>
              <label htmlFor="cantidad-stock" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad en Stock
              </label>
              <p id="cantidad-stock" className="text-sm text-gray-900">
              {material.Cantidad} unidades
              </p>
            </div>

            <div>
              <label htmlFor="precio-unitario" className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario
              </label>
              <p id="precio-unitario" className="text-sm text-gray-900">
                ₡{material.Precio_Unitario?.toLocaleString() || '0'}
              </p>
            </div>

              <div>
                <label htmlFor="proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor
                </label>
                <p id="proveedor" className="text-sm text-gray-900">
                  {material?.Proveedor?.Razon_Social || material?.Proveedor?.Nombre_Proveedor || 'No especificado'}
                </p>
              </div>

              <div>
                <label htmlFor="tipo-proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Proveedor
                </label>
                <p id="tipo-proveedor" className="text-sm text-gray-900">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    material?.Proveedor?.Id_Tipo_Proveedor === 1 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : material?.Proveedor?.Id_Tipo_Proveedor === 2
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}>
                    {material?.Proveedor?.Id_Tipo_Proveedor === 1 
                      ? 'Físico' 
                      : material?.Proveedor?.Id_Tipo_Proveedor === 2
                      ? 'Jurídico'
                      : 'No especificado'}
                  </span>
                </p>
              </div>
          

            <div>
              <label htmlFor="fecha-entrada" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada
              </label>
              <p className="text-sm text-gray-900">
                {new Date(material.Fecha_Entrada).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label htmlFor="fecha-actualizacion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Actualización
              </label>
              <p className="text-sm text-gray-900">
                {new Date(material.Fecha_Actualizacion).toLocaleDateString()}
              </p>
            </div>

            {material.Fecha_Salida && (
              <div>
                <label htmlFor="fecha-salida" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Salida
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(material.Fecha_Salida).toLocaleDateString()}
                </p>
              </div>
            )}

            {material.Fecha_Baja && (
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Baja
                </span>
                <p className="text-sm text-gray-900">
                  {new Date(material.Fecha_Baja).toLocaleDateString()}
                </p>
              </div>
            )}
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
  )
}

export default DetailMaterialModal
