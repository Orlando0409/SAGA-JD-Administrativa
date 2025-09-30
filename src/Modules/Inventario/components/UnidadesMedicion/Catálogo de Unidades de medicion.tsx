import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuSearch, LuPencil, LuTrash2, LuEye, LuToggleLeft, LuToggleRight, LuArrowLeft } from 'react-icons/lu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";
import { useUnidadesMedicion, useDeleteUnidadMedicion, useUpdateEstadoUnidadMedicion } from '../../hooks/HookUnidadMedicion';
import CreateUnidadMedicionModal from './CreateUnidadMedicionModal';
import EditUnidadMedicionModal from './EditUnidadMedicionModal';
import DetailUnidadMedicionModal from './DetailUnidadMedicionModal';
import type { UnidadMedicion } from '../../models/Inventario';

interface UnidadesMedicionManagementProps {
  onBack?: () => void;
}

const UnidadesMedicionManagement: React.FC<UnidadesMedicionManagementProps> = ({ onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<UnidadMedicion | null>(null);

  const { data: unidades = [], isLoading, error } = useUnidadesMedicion();
  const deleteUnidadMutation = useDeleteUnidadMedicion();
  const updateEstadoMutation = useUpdateEstadoUnidadMedicion();


  const columnHelper = createColumnHelper<UnidadMedicion>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('Nombre_Unidad', {
      header: 'Nombre',
      cell: info => (
        <button 
          className="font-medium transition-colors text-left w-full"
          onClick={() => handleViewDetail(info.row.original)}
        >
          {info.getValue()}
        </button>
      ),
    }),
    columnHelper.accessor('Abreviatura', {
      header: 'Abreviatura',
      cell: info => (
        <div className="flex justify-center">
          <span className="inline-flex px-2 py-1 text-sm font-mono font-semibold rounded  text-gray-800">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('Estado_Unidad_Medicion.Nombre_Estado_Unidad_Medicion', {
      header: 'Estado',
      cell: info => {
        const estado = info.getValue();
        return (
          <div className="flex items-center justify-center gap-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              estado === 'Activo' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {estado}
            </span>
            <button
              onClick={() => handleToggleEstado(info.row.original)}
              disabled={updateEstadoMutation.isPending}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title={`Cambiar a ${estado === 'Activo' ? 'Inactivo' : 'Activo'}`}
            >
              {estado === 'Activo' ? (
                <LuToggleRight className="w-5 h-5 text-green-600" />
              ) : (
                <LuToggleLeft className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => (
        <div className="flex justify-center gap-2">
          <button
            className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
            onClick={() => handleViewDetail(info.row.original)}
            title="Ver detalles"
          >
            <LuEye className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
            onClick={() => handleEdit(info.row.original)}
            title="Editar"
          >
            <LuPencil className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            onClick={() => handleDelete(info.row.original)}
            disabled={deleteUnidadMutation.isPending}
            title="Eliminar"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ], [deleteUnidadMutation.isPending, updateEstadoMutation.isPending]);

  const table = useReactTable({
    data: unidades,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleEdit = (unidad: UnidadMedicion) => {
    setSelectedUnidad(unidad);
    setShowEditModal(true);
  };

  const handleViewDetail = (unidad: UnidadMedicion) => {
    setSelectedUnidad(unidad);
    setShowDetailModal(true);
  };

  const handleToggleEstado = async (unidad: UnidadMedicion) => {
    try {
      await updateEstadoMutation.mutateAsync({
        unidadId: unidad.Id_Unidad_Medicion,
        estadoId: unidad.Estado_Unidad_Medicion.Id_Estado_Unidad_Medicion === 1 ? 2 : 1
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const handleDelete = async (unidad: UnidadMedicion) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la unidad "${unidad.Nombre_Unidad}"?`)) {
      try {
        await deleteUnidadMutation.mutateAsync(unidad.Id_Unidad_Medicion);
      } catch (error) {
        console.error('Error al eliminar unidad:', error);
      }
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando unidades de medición...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error al cargar las unidades de medición. Por favor, intenta nuevamente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de regreso */}
      {onBack && (
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">
            Unidades de Medición
          </h1>
        </div>
      )}

      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar unidades..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
          <LuPlus className="w-4 h-4" />
          Nueva Unidad
         </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th key={header.id} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      index === 0 ? 'text-left' : 'text-center'
                    }`}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? `cursor-pointer select-none flex items-center gap-2 ${
                            index === 0 ? 'justify-start' : 'justify-center'
                          }` : `${index === 0 ? 'text-left' : 'text-center'}`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.columnDef.header as string}
                          {{
                            asc: <MdKeyboardArrowUp className="w-4 h-4" />,
                            desc: <MdKeyboardArrowDown className="w-4 h-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {globalFilter ? 'No se encontraron unidades que coincidan con la búsqueda' : 'No hay unidades de medición registradas'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell, index) => (
                      <td key={cell.id} className={`px-6 py-4 whitespace-nowrap ${
                        index === 0 ? 'text-left' : 'text-center'
                      }`}>
                        {cell.column.columnDef.cell ? 
                          (typeof cell.column.columnDef.cell === 'function' ? cell.column.columnDef.cell(cell.getContext()) : cell.column.columnDef.cell) :
                          cell.getValue() as React.ReactNode
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {table.getPageCount() > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
                  {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{' '}
                  {table.getFilteredRowModel().rows.length} resultados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardDoubleArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </span>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdKeyboardDoubleArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateUnidadMedicionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedUnidad && (
        <>
          <EditUnidadMedicionModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUnidad(null);
            }}
            unidad={selectedUnidad}
          />

          <DetailUnidadMedicionModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedUnidad(null);
            }}
            unidad={selectedUnidad}
          />
        </>
      )}
    </div>
  );
};

export default UnidadesMedicionManagement;