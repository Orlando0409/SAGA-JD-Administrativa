import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuSearch } from 'react-icons/lu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter
} from "@/Modules/Global/components/Sidebar/ui/alert-dialog";
import { useGetAllCategories, useGetCategoriasActivas, useGetCategoriasInactivas, useUpdateEstadoCategoria } from '../../hooks/useCategorias';
import { getCategoriasLoadingState, getCategoriasErrorState } from '../../helper/CategoriasHelpers';
import CreateCategoriaModal from './CreateCategoriaModal';
import EditCategoriaModal from './EditCategoriaModal';
import DetailCategoriaModal from './DetailCategoriaModal';
import type { CategoriaMaterial } from '../../models/Inventario';
import { useAuth } from '@/Modules/Auth/Context/AuthContext';

interface CategoriasManagementProps {
  onBack?: () => void;
}

const CategoriasManagement: React.FC<CategoriasManagementProps> = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaMaterial | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<string>('Todas'); // Por defecto mostrar todas
  const { user } = useAuth();
  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });
  
  const { data: todasCategorias = [], isLoading: isLoadingTodas, error: errorTodas } = useGetAllCategories();
  const { data: categoriasActivas = [], isLoading: isLoadingActivas, error: errorActivas } = useGetCategoriasActivas();
  const { data: categoriasInactivas = [], isLoading: isLoadingInactivas, error: errorInactivas } = useGetCategoriasInactivas();
  const updateEstadoMutation = useUpdateEstadoCategoria();

  // Seleccionar los datos según el filtro
  const categorias = useMemo(() => {
    if (estadoFilter === 'Todas') {
      return todasCategorias;
    } else if (estadoFilter === 'Activa') {
      return categoriasActivas;
    } else {
      return categoriasInactivas;
    }
  }, [estadoFilter, todasCategorias, categoriasActivas, categoriasInactivas]);

  // Determinar el estado de carga y error 
  const isLoading = getCategoriasLoadingState(estadoFilter, {
    todas: isLoadingTodas,
    activas: isLoadingActivas,
    inactivas: isLoadingInactivas
  });
  
  const error = getCategoriasErrorState(estadoFilter, {
    todas: errorTodas,
    activas: errorActivas,
    inactivas: errorInactivas
  });


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
    columnHelper.accessor('Descripcion_Categoria', {
      header: 'Descripción',
      cell: info => (
        <div className="text-gray-600 text-left max-w-xs truncate">
          {info.getValue() || 'Sin descripción'}
        </div>
      ),
    }),
    columnHelper.accessor('Estado_Categoria.Nombre_Estado_Categoria', {
      header: 'Estado',
      cell: info => {
        const estado = info.getValue() || 'Activa';
        const isActiva = estado === 'Activa';
        const colorClass = isActiva 
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          : 'bg-slate-200 text-slate-700 border border-slate-400';
        
        return (
          <div className="flex justify-start">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
              {estado}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => (
        <div className="flex justify-center gap-1">
          <button
            className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            onClick={() => handleViewDetail(info.row.original)}
            title="Ver detalles"
          >
            Ver
          </button>
          <button
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            onClick={() => handleEdit(info.row.original)}
            title="Editar"
          >
            Editar
          </button>
            {info.row.original.Estado_Categoria?.Nombre_Estado_Categoria === 'Activa' ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    disabled={updateEstadoMutation.isPending}
                    title="Desactivar"
                  >
                    Desactivar
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <span>¿Desactivar categoría?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span>¿Estás seguro de que deseas desactivar la categoría "{info.row.original.Nombre_Categoria}"?</span>
                      <br />
                      <span>Esta acción puede revertirse posteriormente.</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => handleToggleEstado(info.row.original)}
                      disabled={updateEstadoMutation.isPending}
                    >
                      <span>Desactivar</span>
                    </AlertDialogAction>
                    <AlertDialogCancel>
                      <span>Cancelar</span>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    disabled={updateEstadoMutation.isPending}
                    title="Activar"
                  >
                    Activar
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <span>¿Activar categoría?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span>¿Estás seguro de que deseas activar la categoría "{info.row.original.Nombre_Categoria}"?</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction
                      onClick={() => handleToggleEstado(info.row.original)}
                      disabled={updateEstadoMutation.isPending}
                    >
                      <span>Activar</span>
                    </AlertDialogAction>
                    <AlertDialogCancel>
                      <span>Cancelar</span>
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
        </div>
      ),
    }),
  ], [updateEstadoMutation.isPending]);

 
  const table = useReactTable({
    data: categorias,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  
  const handleEdit = (categoria: CategoriaMaterial) => {
    setSelectedCategoria(categoria);
    setShowEditModal(true);
  };

  const handleViewDetail = (categoria: CategoriaMaterial) => {
    setSelectedCategoria(categoria);
    setShowDetailModal(true);
  };

  const handleToggleEstado = async (categoria: CategoriaMaterial) => {
      try {
        await updateEstadoMutation.mutateAsync({
          id: categoria.Id_Categoria,
          nuevoEstado: categoria.Estado_Categoria?.Id_Estado_Categoria === 1 ? 2 : 1,
          idUsuario: user?.Id_Usuario || 0

        });
      } catch (error) {
        console.error('Error al cambiar estado de la categoría:', error);
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
 
      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor='estado' className="text-sm font-medium text-gray-700">Estado:</label>
            <select
              id='estado'
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Activa">Activas</option>
              <option value="Inactiva">Inactivas</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
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
      </div>

      
<div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="text-left text-xs sm:text-sm text-sky-700">
                  {headerGroup.headers.map((header, index) => (
                    <th key={header.id} className={`px-2 sm:px-4 py-3 font-medium border-b border-sky-100 ${
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
                              <span className="flex items-center gap-1">
                                {header.column.columnDef.header as string}
                                {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                                {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                              </span>
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
            <tbody className="bg-white divide-y divide-sky-50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 sm:px-4 py-8 text-center text-slate-500">
                    {globalFilter ? 'No se encontraron categorías que coincidan con la búsqueda' : 'No hay categorías registradas'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-sky-50 cursor-pointer transition-colors">
                    {row.getVisibleCells().map((cell, index) => {
                      let cellContent: React.ReactNode;
                      
                      if (cell.column.columnDef.cell) {
                        if (typeof cell.column.columnDef.cell === 'function') {
                          cellContent = cell.column.columnDef.cell(cell.getContext());
                        } else {
                          cellContent = cell.column.columnDef.cell;
                        }
                      } else {
                        cellContent = cell.getValue() as React.ReactNode;
                      }
                      
                      return (
                        <td key={cell.id} className={`px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top ${
                          index === 0 ? 'text-left' : 'text-center'
                        }`}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

  
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Filas por página:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {pageSizeOptions.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Primera página"
              >
                <MdKeyboardDoubleArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <MdKeyboardArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <MdKeyboardArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 rounded-md border text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Última página"
              >
                <MdKeyboardDoubleArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

   
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