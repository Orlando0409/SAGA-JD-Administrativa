import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuFilter, LuSearch } from 'react-icons/lu';
import { useMaterials } from '../hooks/InventarioHook';

import type { Material } from '../models/Inventario';
import type { MaterialFilterOptions } from '../types/MaterialTypes';
import CreateMaterialModal from './CreateMaterialModal';
import DetailMaterialModal from './DetailMaterialModal';
import FilterMaterialModal from './FilterMaterialModal';

const Inventario = () => {
  const { data: materials = [], isLoading, refetch } = useMaterials();
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<MaterialFilterOptions>({});

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('refreshInventario', handler);
    return () => window.removeEventListener('refreshInventario', handler);
  }, [refetch]);

  const applyCustomFilters = (data: Material[], filters: MaterialFilterOptions): Material[] => {
    if (!filters.categoria && !filters.estado && !filters.conStock && !filters.precioMin && !filters.precioMax) {
      return data;
    }
    
    return data.filter(material => {
      if (filters.categoria && !material.Categorias.some(cat => cat.Nombre_Categoria_Material === filters.categoria)) {
        return false;
      }
      if (filters.estado && material.Estado_Material.Nombre_Estado_Material !== filters.estado) {
        return false;
      }
      if (filters.conStock && material.Cantidad <= 0) {
        return false;
      }
      if (filters.precioMin && material.Precio_Unitario < filters.precioMin) {
        return false;
      }
      if (filters.precioMax && material.Precio_Unitario > filters.precioMax) {
        return false;
      }
      return true;
    });
  };

  const filteredMaterials = useMemo(() => {
    return applyCustomFilters(materials, appliedFilters);
  }, [materials, appliedFilters]);

  const columnHelper = createColumnHelper<Material>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('Nombre_Material', {
        header: 'Material',
        cell: info => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('Descripcion', {
        header: 'Descripción',
        cell: info => (
          <div className="text-gray-600 max-w-xs truncate">
            {info.getValue() || 'Sin descripción'}
          </div>
        ),
      }),
      columnHelper.accessor('Cantidad', {
        header: 'Cantidad',
        cell: info => (
          <div className={`font-semibold ${info.getValue() <= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('Precio_Unitario', {
        header: 'Precio Unitario',
        cell: info => (
          <div className="font-medium">
            ₡{info.getValue().toLocaleString('es-CR', { minimumFractionDigits: 2 })}
          </div>
        ),
      }),
      columnHelper.accessor('Estado_Material.Nombre_Estado_Material', {
        header: 'Estado',
        cell: info => {
          const estado = info.getValue();
          let colorClass = '';
          if (estado === 'DISPONIBLE') {
            colorClass = 'bg-green-100 text-green-800';
          } else if (estado === 'AGOTADO') {
            colorClass = 'bg-red-100 text-red-800';
          } else {
            colorClass = 'bg-yellow-100 text-yellow-800';
          }
          return (
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${colorClass}`}>
              {estado}
            </span>
          );
        },
      }),
      columnHelper.accessor('Categorias', {
        header: 'Categorías',
        cell: info => {
          const categorias = info.getValue() || [];
          return (
            <div className="flex flex-wrap gap-1">
              {categorias.slice(0, 2).map((categoria, index) => (
                <span key={categoria.Id_Categoria_Material || index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {categoria.Nombre_Categoria_Material}
                </span>
              ))}
              {categorias.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{categorias.length - 2}
                </span>
              )}
            </div>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredMaterials,
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
        pageSize: 10,
      },
    },
  });

  const handleRowClick = (material: Material) => {
    setSelectedMaterial(material);
    setShowDetailModal(true);
  };

  const handleApplyFilters = (filters: MaterialFilterOptions) => {
    setAppliedFilters(filters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const activeFiltersCount = Object.values(appliedFilters).filter(v => 
    v !== undefined && v !== '' && v !== false
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
      </div>

      {/* Filters and Search */}
      <div className="flex  sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar materiales..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-[30vw] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilterModal(true)}
          className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
            activeFiltersCount > 0
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <LuFilter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
          <button
            onClick={() => console.log('TODO: Crear modal de nueva categoría')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
          >
            <LuPlus className="w-4 h-4" />
            Nueva Categoría
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <LuPlus className="w-4 h-4" />
            Nuevo Material
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder ? null : (
                          <>
                            {typeof header.column.columnDef.header === 'function'
                              ? header.column.columnDef.header(header.getContext())
                              : header.column.columnDef.header}
                            {{
                              asc: ' 🔺',
                              desc: ' 🔻',
                            }[header.column.getIsSorted() as string] ?? null}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                      {typeof cell.column.columnDef.cell === 'function'
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue() as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Mostrar</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span>de {table.getFilteredRowModel().rows.length} resultados</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              {'<'}
            </button>
            <span className="px-2 py-1 text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <CreateMaterialModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedMaterial && (
        <DetailMaterialModal
          material={selectedMaterial}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMaterial(null);
          }}
        />
      )}

      <FilterMaterialModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />

    </div>
  );
};

export default Inventario;