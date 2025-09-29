import React, { useState } from 'react';
import { LuPlus, LuPencil, LuTrash2, LuEye } from 'react-icons/lu';
import { useUnidadesMedicion, useDeleteUnidadMedicion } from '../../hooks/HookUnidadMedicion';
import type { UnidadMedicion } from '../../models/UnidadMedicion';
import CreateUnidadMedicionModal from './CreateUnidadMedicionModal';


const UnidadesMedicion: React.FC = () => {
  const { data: unidadesMedicion = [], isLoading, isError } = useUnidadesMedicion();
  const deleteUnidadMedicionMutation = useDeleteUnidadMedicion();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadMedicion | null>(null);

  const handleEdit = (unidad: UnidadMedicion) => {
    setSelectedUnidad(unidad);
    setIsEditModalOpen(true);
  };

  const handleDetail = (unidad: UnidadMedicion) => {
    setSelectedUnidad(unidad);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (unidad: UnidadMedicion) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la unidad "${unidad.Nombre_Unidad}"?`)) {
      try {
        await deleteUnidadMedicionMutation.mutateAsync(unidad.Id_Unidad_Medicion);
      } catch (error) {
        console.error('Error al eliminar unidad de medición:', error);
      }
    }
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedUnidad(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las unidades de medición</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Unidades de Medición</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <LuPlus className="w-4 h-4" />
          Nueva Unidad
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abreviatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {unidadesMedicion.map((unidad) => (
                <tr key={unidad.Id_Unidad_Medicion} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unidad.Nombre_Unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {unidad.Abreviatura}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      unidad.Estado_Unidad_Medicion.Nombre_Estado_Unidad_Medicion === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {unidad.Estado_Unidad_Medicion.Nombre_Estado_Unidad_Medicion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(unidad.Fecha_Creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDetail(unidad)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Ver detalles"
                      >
                        <LuEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(unidad)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        title="Editar"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(unidad)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Eliminar"
                        disabled={deleteUnidadMedicionMutation.isPending}
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {unidadesMedicion.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay unidades de medición registradas</p>
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateUnidadMedicionModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
      />

 
    </div>
  );
};

export default UnidadesMedicion;