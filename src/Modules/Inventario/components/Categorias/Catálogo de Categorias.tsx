import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuSearch, LuPencil, LuEye, LuArrowLeft } from 'react-icons/lu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";
import { useGetAllCategories, useDeleteCategoria } from '../../hooks/useCategorias';
import CreateCategoriaModal from './CreateCategoriaModal';
import EditCategoriaModal from './EditCategoriaModal';
import DetailCategoriaModal from './DetailCategoriaModal';
import type { CategoriaMaterial } from '../../models/Inventario';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FiXCircle } from "react-icons/fi"; 

interface CategoriasManagementProps {
  onBack?: () => void;
}

const CategoriasManagement: React.FC<CategoriasManagementProps> = ({ onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaMaterial | null>(null);


  // Hooks
  const { data: categorias = [], isLoading, error } = useGetAllCategories();
  const deleteMutation = useDeleteCategoria();

  // Configuración de columnas
  const columnHelper = createColumnHelper<CategoriaMaterial>();
  
  const columns = useMemo(() => [
    columnHelper.accessor('Nombre_Categoria', {
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
    columnHelper.display({
      id: 'estado',
      header: 'Estado',
      cell: () => (
        <div className="flex justify-center">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Activa
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => (
        <div className="flex justify-center gap-2">
          <button
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
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
            disabled={deleteMutation.isPending}
            title="desactivar"
          >
            {deleteMutation.isPending && deleteMutation.variables === info.row.original.Id_Categoria ? (
              <IoMdCheckmarkCircleOutline className="w-4 h-4" />
            ) : (
              <FiXCircle className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    }),
  ], [deleteMutation.isPending]);

  // Configuración de la tabla
  const table = useReactTable({
    data: categorias,
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

  // Handlers
  const handleEdit = (categoria: CategoriaMaterial) => {
    setSelectedCategoria(categoria);
    setShowEditModal(true);
  };

  const handleViewDetail = (categoria: CategoriaMaterial) => {
    setSelectedCategoria(categoria);
    setShowDetailModal(true);
  };

  const handleDelete = async (categoria: CategoriaMaterial) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.Nombre_Categoria}"?`)) {
      try {
        await deleteMutation.mutateAsync(categoria.Id_Categoria);
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error al cargar las categorías. Por favor, intenta nuevamente.
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
            Gestión de Categorías
          </h1>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar categorías..."
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
            Nueva Categoría
         </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 justify-between">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <th key={header.id} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      index === 0 ? 'text-left' : 'text-center'
                    }`}>
                      {(() => {
                        if (header.isPlaceholder) {
                          return null;
                        }
                        if (header.column.getCanSort()) {
                          return (
                            <button
                              type="button"
                              className={`cursor-pointer select-none flex items-center gap-2 bg-transparent border-none p-0 ${
                                index === 0 ? 'justify-start' : 'justify-center'
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  header.column.getToggleSortingHandler()?.(e);
                                }
                              }}
                              tabIndex={0}
                              aria-label={`Ordenar por ${header.column.columnDef.header as string}`}
                            >
                              {header.column.columnDef.header as string}
                              {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="w-4 h-4" />}
                              {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="w-4 h-4" />}
                            </button>
                          );
                        }
                        return (
                          <span className={index === 0 ? 'text-left' : 'text-center'}>
                            {header.column.columnDef.header as string}
                          </span>
                        );
                      })()}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    {globalFilter ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No hay categorías registradas'}
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

        {/* Paginación */}
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

      {/* Modales */}
      <CreateCategoriaModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedCategoria && (
        <>
          <EditCategoriaModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCategoria(null);
            }}
            categoria={selectedCategoria}
          />

          <DetailCategoriaModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedCategoria(null);
            }}
            categoria={selectedCategoria}
          />
        </>
      )}
    </div>
  );
};

export default CategoriasManagement;