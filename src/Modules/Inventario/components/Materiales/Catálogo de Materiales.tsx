import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { LuPlus, LuFilter, LuSearch, LuArrowLeft } from 'react-icons/lu';
import { 
  useGetAllMaterials, 
  useGetMaterialesConCategorias, 
  useGetMaterialesSinCategorias,
  useGetMaterialesPorDebajoDeStock,
  useGetMaterialesPorEncimaDeStock,
} from '../../hooks/useMaterials';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight, 
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";

import type { Material } from '../../models/Inventario';
import type { MaterialFilterOptions } from '../../types/MaterialTypes';
import CreateMaterialModal from './CreateMaterialModal';
import DetailMaterialModal from './DetailMaterialModal';
import FilterMaterialModal from './FilterMaterialModal';
import EditMaterialModal from './EditMaterialModal';

interface CatalogoMaterialesProps {
  onBack?: () => void;
}

const CatalogoMateriales: React.FC<CatalogoMaterialesProps> = ({ onBack }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<MaterialFilterOptions>({});
  const [estadoFilter, setEstadoFilter] = useState<string>('Disponible'); // Por defecto mostrar solo activos
  const { data: allMaterials = [], isLoading: isLoadingAll, refetch: refetchAllMaterials } = useGetAllMaterials();
  const { data: materialesConCategorias = [], isLoading: isLoadingConCat, refetch: refetchConCat } = useGetMaterialesConCategorias();
  const { data: materialesSinCategorias = [], isLoading: isLoadingSinCat, refetch: refetchSinCat } = useGetMaterialesSinCategorias();
  const { data: materialesEncimaStock = [], isLoading: isLoadingAbove, refetch: refetchAbove } = useGetMaterialesPorEncimaDeStock(
    appliedFilters.stockMinimo || 0, 

  );
  const { data: materialesDebajoStock = [], isLoading: isLoadingBelow, refetch: refetchBelow } = useGetMaterialesPorDebajoDeStock(
    appliedFilters.stockMaximo || 0, 
  );

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const refetchAllData = () => {
    refetchAllMaterials();
    refetchConCat();
    refetchSinCat();
    refetchAbove();
    refetchBelow();
  };

  useEffect(() => {
    const handler = () => refetchAllData();
    window.addEventListener('refreshInventario', handler);
    return () => window.removeEventListener('refreshInventario', handler);
  }, []);

  const { materials, isLoading } = useMemo(() => {
    if (appliedFilters.soloConCategorias) {
      return { materials: materialesConCategorias, isLoading: isLoadingConCat };
    }
    if (appliedFilters.soloSinCategorias) {
      return { materials: materialesSinCategorias, isLoading: isLoadingSinCat };
    }
    if (appliedFilters.tipoFiltroStock === 'encima' && appliedFilters.stockMinimo) {
      return { materials: materialesEncimaStock, isLoading: isLoadingAbove };
    }
    if (appliedFilters.tipoFiltroStock === 'debajo' && appliedFilters.stockMaximo) {
      return { materials: materialesDebajoStock, isLoading: isLoadingBelow };
    }
    
    return { materials: allMaterials, isLoading: isLoadingAll };
  }, [
    appliedFilters, 
    allMaterials, isLoadingAll,
    materialesConCategorias, isLoadingConCat,
    materialesSinCategorias, isLoadingSinCat,
    materialesEncimaStock, isLoadingAbove,
    materialesDebajoStock, isLoadingBelow
  ]);

  const filterByCategoria = (material: Material, categoria?: string | (string | number)[]) => {
    if (!categoria || (Array.isArray(categoria) && categoria.length === 0)) return true;
    
    const categorias = (material.materialCategorias && material.materialCategorias.length > 0) 
      ? material.materialCategorias 
      : (material.Categorias || []);
    
    if (Array.isArray(categoria)) {
      return categorias.some(cat =>
        categoria.includes(cat.Categoria.Nombre_Categoria) ||
        categoria.includes(cat.Categoria.Id_Categoria)
      );
    }
    return categorias.some(cat => 
      cat.Categoria.Nombre_Categoria === categoria ||
      String(cat.Categoria.Id_Categoria) === String(categoria)
    );
  };

  const filterByEstado = (material: Material, estado?: string) => {
    if (!estado) return true;
    return material.Estado_Material.Nombre_Estado_Material === estado;
  };

  const filterByStock = (material: Material, conStock?: boolean) => {
    if (!conStock) return true;
    return material.Cantidad > 0;
  };

  const filterByPrecioMin = (material: Material, precioMin?: number) => {
    if (!precioMin) return true;
    return material.Precio_Unitario >= precioMin;
  };

  const filterByPrecioMax = (material: Material, precioMax?: number) => {
    if (!precioMax) return true;
    return material.Precio_Unitario <= precioMax;
  };

  const filterByStockEntre = (material: Material, tipoFiltroStock?: string, stockMinimo?: number, stockMaximo?: number) => {
    if (tipoFiltroStock !== 'entre') return true;
    if (stockMinimo && material.Cantidad < stockMinimo) return false;
    if (stockMaximo && material.Cantidad > stockMaximo) return false;
    return true;
  };

  const applyAdditionalFilters = (data: Material[], filters: MaterialFilterOptions): Material[] => {
    return data.filter(material =>
      filterByCategoria(material, filters.categoria) &&
      filterByEstado(material, filters.estado) &&
      filterByStock(material, filters.conStock) &&
      filterByPrecioMin(material, filters.precioMin) &&
      filterByPrecioMax(material, filters.precioMax) &&
      filterByStockEntre(material, filters.tipoFiltroStock, filters.stockMinimo, filters.stockMaximo)
    );
  };

  const filteredMaterials = useMemo(() => {
    let filtered = applyAdditionalFilters(materials, appliedFilters);
    
    
    if (estadoFilter !== 'Todos') {
      filtered = filtered.filter(material => 
        material.Estado_Material?.Nombre_Estado_Material === estadoFilter
      );
    }
    
    return filtered;
  }, [materials, appliedFilters, estadoFilter]);

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
      columnHelper.accessor((row) => row.Unidad_Medicion?.Nombre_Unidad_Medicion || row.Unidad_Medicion?.Nombre_Unidad, {
        header: 'Unidad de medida',
        cell: info => (
          <div className="text-sm text-gray-600">
            {info.getValue() || 'Sin unidad'}
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
          if (estado === 'Disponible') {
            colorClass = 'bg-green-100 text-green-800';
          } else if (estado === 'Agotado') {
            colorClass = 'bg-red-100 text-red-800';
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
          
          if (!categorias || categorias.length === 0) {
            return (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                Sin categoría
              </span>
            );
          }
          
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {categorias.slice(0, 3).map((categoria, index) => (
                <span 
                  key={categoria.Id_Material_Categoria || index} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs whitespace-nowrap"
                >
                  {categoria.Categoria?.Nombre_Categoria || 'N/A'}
                </span>
              ))}
              {categorias.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{categorias.length - 3}
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: 'acciones',
        header: 'Acciones',
        cell: info => (
          <div className="flex justify-start gap-1">
            <button
              className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
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
          </div>
        ),
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
        pageSize: 5,
      },
    },
  });
    const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setShowEditModal(true);
  };

  const handleViewDetail = (material: Material) => {
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

  const renderMaterialesView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
    <div className="space-y-6">
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
            Catálogo de Materiales
          </h1>
        </div>
      )}

      <div className="bg-white rounded-lg p-3">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label htmlFor="estado-filter-select" className="text-sm font-medium text-gray-700">Estado:</label>
            <select
              id="estado-filter-select"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Todos">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar materiales..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`px-4 py-2 border rounded-md flex items-center gap-2 transition-colors ${
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
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-4 h-4" />
              Nuevo Material
            </button>
          </div>
        </div>
      </div>

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
                              asc: <MdKeyboardArrowUp />,
                              desc: <MdKeyboardArrowDown />,
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

        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Filas por página</span>
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
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardArrowLeft />
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
              <MdKeyboardArrowRight />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-2 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>


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

        {showEditModal && selectedMaterial && (
        <EditMaterialModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMaterial(null);
          }}
          material={selectedMaterial}
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

  return renderMaterialesView();
}

export default CatalogoMateriales