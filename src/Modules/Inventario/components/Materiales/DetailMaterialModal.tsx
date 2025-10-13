import React, { useEffect, useState } from 'react';
import { LuX } from 'react-icons/lu';
import type { Material, Medidor } from '../../models/Inventario';
import { 
  getEstadoMaterialColorClass, 
  getProveedorNombre, 
  getProveedorTipo, 
  getProveedorTipoColorClass 
} from '../../helper/MaterialesHelpers';
import { getAllMedidores } from '../../service/MaterialService';

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
  const [medidor, setMedidor] = useState<Medidor | null>(null);
  const [loadingMedidor, setLoadingMedidor] = useState(false);
  
  const estado = material.Estado_Material?.Nombre_Estado_Material || 'N/A';
  const colorClass = getEstadoMaterialColorClass(estado);

  const getMedidorEstadoColorClass = (estadoNombre: string): string => {
    if (estadoNombre === 'No Instalado') {
      return 'bg-gray-100 text-gray-700';
    }
    if (estadoNombre === 'Instalado') {
      return 'bg-green-100 text-green-700';
    }
    return 'bg-red-100 text-red-700';
  };

  // Cargar información del medidor si existe
  useEffect(() => {
    if (!isOpen || !material.Id_Material) return;
    
    const loadMedidor = async () => {
      setLoadingMedidor(true);
      try {
        const medidores = await getAllMedidores();
        const medidorEncontrado = medidores.find(
          m => m.Usuario_Creador?.Id_Usuario === material.Id_Material
        );
        setMedidor(medidorEncontrado || null);
      } catch (error) {
        console.error('Error al cargar medidor:', error);
        setMedidor(null);
      } finally {
        setLoadingMedidor(false);
      }
    };

    loadMedidor();
  }, [isOpen, material.Id_Material]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

            {!loadingMedidor && medidor && (
              <>
                <div>
                  <label htmlFor="tipo-material" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Material
                  </label>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-300 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                    </svg>
                    Medidor
                  </span>
                </div>

                <div>
                  <label htmlFor="numero-medidor" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Medidor
                  </label>
                  <p className="text-sm text-gray-900">
                    {medidor.Numero_Medidor}
                  </p>
                </div>

                <div>
                  <label htmlFor="estado-medidor" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado del Medidor
                  </label>
                  <p className="text-sm text-gray-900">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMedidorEstadoColorClass(medidor.Estado_Medidor.Nombre_Estado_Medidor)}`}>
                      {medidor.Estado_Medidor.Nombre_Estado_Medidor}
                    </span>
                  </p>
                </div>

                {medidor.Afiliado && (
                  <div>
                    <label htmlFor="medidor-asignado" className="block text-sm font-medium text-gray-700 mb-1">
                      Medidor Asignado a
                    </label>
                    <p className="text-sm text-gray-900">
                      {medidor.Afiliado.Nombre_Completo_Afiliado || medidor.Afiliado.Razon_Social}
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="fecha-creacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Creación Medidor
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(medidor.Fecha_Creacion).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label htmlFor="ultima-actualizacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Última Actualización Medidor
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(medidor.Fecha_Actualizacion).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}

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
                  {getProveedorNombre(material)}
                </p>
              </div>

              <div>
                <label htmlFor="tipo-proveedor" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Proveedor
                </label>
                <p id="tipo-proveedor" className="text-sm text-gray-900">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getProveedorTipoColorClass(material?.Proveedor?.Id_Tipo_Proveedor)}`}>
                    {getProveedorTipo(material?.Proveedor?.Id_Tipo_Proveedor)}
                  </span>
                </p>
              </div>
          

            <div>
              <label htmlFor="fecha-entrada" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada
              </label>
              <p className="text-sm text-gray-900">
                {material.Fecha_Entrada ? new Date(material.Fecha_Entrada).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div>
              <label htmlFor="fecha-actualizacion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Actualización
              </label>
              <p className="text-sm text-gray-900">
                {material.Fecha_Actualizacion ? new Date(material.Fecha_Actualizacion).toLocaleDateString() : 'N/A'}
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
