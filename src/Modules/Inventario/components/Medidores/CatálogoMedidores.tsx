import { useState, useMemo } from 'react';
import { LuPlus, LuSearch } from 'react-icons/lu';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp
} from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/Modules/Global/components/Sidebar/ui/alert-dialog';
import { useMedidores, useMedidoresPorEstado, useUpdateEstadoMedidor } from '../../hooks/useMedidores';
import type { Medidor } from '../../models/Medidor';
import CreateMedidorModal from './CreateMedidorModal';
import DetailMedidorModal from './DetailMedidorModal';

interface CatalogoMedidoresProps {
  onBack?: () => void;
}

const CatalogoMedidores: React.FC<CatalogoMedidoresProps> = () => {

  const [globalFilter, setGlobalFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMedidor, setSelectedMedidor] = useState<Medidor | null>(null);
  const [estadoFilter, setEstadoFilter] = useState<string>('Todos');


  // Llama todos los hooks en el nivel superior del componente
  const medidoresTodos = useMedidores();
  const medidoresNoInstalados = useMedidoresPorEstado('no-instalados');
  const medidoresInstalados = useMedidoresPorEstado('instalados');
  const medidoresAveriados = useMedidoresPorEstado('averiados');
  const updateEstadoMutation = useUpdateEstadoMedidor();

  // Selecciona los datos y estados según el filtro
  let medidores: Medidor[] = [];
  let isLoading = false;
  let error: unknown = null;
  let refetch = () => {};

  if (estadoFilter === 'No instalado') {
    medidores = medidoresNoInstalados.data ?? [];
    isLoading = medidoresNoInstalados.isLoading;
    error = medidoresNoInstalados.error;
    refetch = medidoresNoInstalados.refetch;
  } else if (estadoFilter === 'Instalado') {
    medidores = medidoresInstalados.data ?? [];
    isLoading = medidoresInstalados.isLoading;
    error = medidoresInstalados.error;
    refetch = medidoresInstalados.refetch;
  } else if (estadoFilter === 'Averiado') {
    medidores = medidoresAveriados.data ?? [];
    isLoading = medidoresAveriados.isLoading;
    error = medidoresAveriados.error;
    refetch = medidoresAveriados.refetch;
  } else {
    medidores = medidoresTodos.data ?? [];
    isLoading = medidoresTodos.isLoading;
    error = medidoresTodos.error;
    refetch = medidoresTodos.refetch;
  }


  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const handleViewDetail = (medidor: Medidor) => {
    setSelectedMedidor(medidor);
    setIsDetailModalOpen(true);
  };

  const handleCambiarEstado = async (medidor: Medidor) => {
    setSelectedMedidor(medidor);
    try {
      await updateEstadoMutation.mutateAsync({
        idMedidor: medidor.Id_Medidor,
        idEstado: 2,
      });
      refetch();
    } catch (error) {
      console.error('Error al cambiar estado del medidor:', error);
    }
  };


  const handleToggleEstado = async (medidor: Medidor, nuevoEstadoId: number) => {
    
    try {
      await updateEstadoMutation.mutateAsync({
        idMedidor: medidor.Id_Medidor,
        idEstado: nuevoEstadoId,
      });
      refetch();
    } catch (error) {
      console.error('Error al cambiar estado del medidor:', error);
    }
  };

  const columnHelper = createColumnHelper<Medidor>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('Numero_Medidor', {
        header: 'Número del Medidor',
        cell: info => (
          <button 
            className="font-medium transition-colors text-left w-full"
            onClick={() => handleViewDetail(info.row.original)}
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor('Afiliado', {
        header: 'Afiliado',
        cell: info => {
          const afiliado = info.row.original.Afiliado;
          
          if (!afiliado) {
            return (
              <div className="text-gray-600 text-left">
                Sin asignar
              </div>
            );
          }

          return (
            <div className="flex justify-start">
              <span className='text-gray-600 text-left max-w-xs truncate'>{afiliado.Nombre_Completo || afiliado.Razon_Social}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('Estado_Medidor.Nombre_Estado_Medidor', {
        header: 'Estado',
        cell: info => {
          const estado = info.getValue();
          let colorClass = '';

          if (estado === 'No instalado') {
            colorClass = 'bg-orange-100 text-orange-700 border border-orange-300';
          } else if (estado === 'Instalado') {
            colorClass = 'bg-emerald-100 text-emerald-700 border border-emerald-300';
          } else if (estado === 'Averiado') {
            colorClass = 'bg-red-100 text-red-700 border border-red-300';
          }

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
            {(() => {
              const estadoId = info.row.original.Estado_Medidor?.Id_Estado_Medidor;

              if (estadoId === 1) {
                return (
                  <button
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    onClick={() => handleCambiarEstado(info.row.original)}
                    title="Cambiar estado"
                  >
                    Cambiar Estado
                  </button>
                );
              }

              if (estadoId === 2) {
                return (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        disabled={updateEstadoMutation.isPending}
                        title="Marcar como averiado"
                      >
                        Averiado
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          <span>¿Marcar medidor como averiado?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <span>¿Estás seguro de que deseas marcar el medidor #{info.row.original.Numero_Medidor} como averiado?</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => handleToggleEstado(info.row.original, 3)}
                          disabled={updateEstadoMutation.isPending}
                        >
                          <span>Marcar Averiado</span>
                        </AlertDialogAction>
                        <AlertDialogCancel>
                          <span>Cancelar</span>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              }

              if (estadoId === 3) {
                return (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        disabled={updateEstadoMutation.isPending}
                        title="Marcar como reparado"
                      >
                        Reparar
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          <span>¿Marcar medidor como reparado?</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <span>¿Estás seguro de que deseas marcar el medidor #{info.row.original.Numero_Medidor} como reparado? Volverá a estado "Instalado".</span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => handleToggleEstado(info.row.original, 2)}
                          disabled={updateEstadoMutation.isPending}
                        >
                          <span>Marcar Reparado</span>
                        </AlertDialogAction>
                        <AlertDialogCancel>
                          <span>Cancelar</span>
                        </AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                );
              }

              return null;
            })()}
          </div>
        ),
      }),
    ],
    [updateEstadoMutation.isPending]
  );

  const table = useReactTable({
    data: medidores,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando medidores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error al cargar los medidores. Por favor, intenta nuevamente.
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
              <option value="Todos">Todos los medidores</option>
              <option value="No instalado">No instalado</option>
              <option value="Instalado">Instalado</option>
              <option value="Averiado">Averiado</option>
            </select>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar medidores..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <LuPlus className="w-4 h-4" />
              Nuevo Medidor
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
                    {globalFilter ? 'No se encontraron medidores que coincidan con la búsqueda' : 'No hay medidores registrados'}
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

      <CreateMedidorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedMedidor && (
        <DetailMedidorModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedMedidor(null);
          }}
          medidor={selectedMedidor}
        />
      )}
    </div>
  );
};

export default CatalogoMedidores;