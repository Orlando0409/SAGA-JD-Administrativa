import { useState } from "react";
import { useGetCalidadAgua, useToggleVisibilidadCalidadAgua } from "../Hook/HookCalidadAgua";
import CalidadAguaModal from "./CalidadAguaModal";
import CalidadAguaEdit from "./CalidadAguaEdit";
import FormularioCalidadAgua from "./FormularioCalidadAgua";
import { Plus, Eye, EyeOff } from "lucide-react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp} from "react-icons/md";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

import { useAlerts } from "@/Modules/Global/context/AlertContext";


export default function CalidadAguaTable() {
  const { data: archivos, isLoading, isError, refetch } = useGetCalidadAgua();
  const toggleVisibilidad = useToggleVisibilidadCalidadAgua();

  const { showSuccess, showError } = useAlerts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoCalidadAgua | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const handleOpenModal = (archivo: ArchivoCalidadAgua) => {
    setArchivoSeleccionado(archivo);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setArchivoSeleccionado(null);
  };

  const handleOpenEditModal = (archivo: ArchivoCalidadAgua) => {
    setArchivoSeleccionado(archivo);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setArchivoSeleccionado(null);
  };

  const handleToggleVisible = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toggleVisibilidad.mutate(id, {
      onSuccess: () => {
        showSuccess("Visibilidad actualizada correctamente");
      },
      onError: () => {
        showError("Error al cambiar la visibilidad");
      },
    });
  };



  // Column helper para definir las columnas
  const columnHelper = createColumnHelper<ArchivoCalidadAgua>();

  // Definir las columnas
  const columns = [
    columnHelper.accessor('Titulo', {
      header: 'Título',
      cell: info => (
        <div className="flex justify-center items-center">
          <span className="font-medium text-left flex items-center gap-2 truncate">
            {info.getValue().length > 30
              ? `${info.getValue().slice(0, 30)}...`
              : info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('Fecha_Creacion', {
      header: 'Fecha de creación',
      cell: info => (
        <div className="flex justify-center items-center">
          <span className="text-gray-600 text-left">{new Date(info.getValue()).toLocaleDateString("es-ES")}</span>
        </div>
      ),
    }),
    columnHelper.accessor('Fecha_Actualizacion', {
      header: 'Fecha de actualización',
      cell: info => (
        <div className="flex justify-center items-center">
          <span className="text-gray-600 text-left">{info.getValue() ? new Date(info.getValue()).toLocaleDateString("es-ES") : "Sin actualizar"}</span>
        </div>
      ),
    }),
    columnHelper.accessor('Visible', {
      header: 'Estado',
      cell: info => (
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => handleToggleVisible(e, info.row.original.Id_Calidad_Agua)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              info.getValue()
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            disabled={toggleVisibilidad.isPending}
          >
            {info.getValue() ? (
              <>
                <Eye size={12} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Visible</span>
              </>
            ) : (
              <>
                <EyeOff size={12} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Oculto</span>
              </>
            )}
          </button>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: info => (
        <div className="flex justify-center gap-1">
          <button
            className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            onClick={() => handleOpenModal(info.row.original)}
            title="Ver detalles"
          >
            Ver
          </button>
          <button
            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            onClick={() => handleOpenEditModal(info.row.original)}
            title="Editar"
          >
            Editar
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: archivos || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
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

  return (
    <div className="w-full">
      {/* Header responsive */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
           <div className="flex items-start gap-4 flex-col justify-start">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Calidad de Agua</h2>
            <p className="text-sm text-gray-600 pb-4">Gestiona los documentos de los resultados de la calidad de agua</p>
        </div>
      
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Buscar archivos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <button
            onClick={() => setFormVisible(true)}
           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            <span className="hidden xs:inline">Crear Archivo</span>
            <span className="xs:hidden">Crear</span>
          </button>
        </div>
      </div>

      {/* Mostrar errores */}
      {isError && <div className="text-red-600 mb-2">Error al cargar los archivos.</div>}

      {/* Tabla responsive */}
      <div className="overflow-x-auto rounded-2xl border border-sky-100 shadow-sm bg-white">
        <table className="min-w-full table-auto text-xs sm:text-sm">
          <thead className="bg-sky-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="text-left text-sky-700">
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`px-2 py-2 sm:px-4 sm:py-3 font-medium border-b border-sky-100 text-center ${
                      index === 0 ? 'min-w-[200px] text-left' :
                      index === 1 || index === 2 ? 'min-w-[120px]' :
                      index === 3 ? 'min-w-[100px]' :
                      'min-w-[120px]'
                    }`}
                  >
                    {(() => {
                      if (header.isPlaceholder) {
                        return null;
                      }
                      if (header.column.getCanSort()) {
                        return (
                          <button
                            type="button"
                            className="cursor-pointer select-none flex items-center justify-center gap-1 bg-transparent border-none p-0 text-xs sm:text-sm w-full"
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
                            <span className="flex items-center justify-start gap-1">
                              {header.column.columnDef.header as string}
                              {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline w-3 h-3 sm:w-4 sm:h-4" />}
                              {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline w-3 h-3 sm:w-4 sm:h-4" />}
                            </span>
                          </button>
                        );
                      }
                      return (
                        <span className="text-xs sm:text-sm block text-start">
                          {header.column.columnDef.header as string}
                        </span>
                      );
                    })()}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/* Extraer la lógica de renderizado de filas en una variable */}
          {(() => {
            let tableBodyContent;
            if (isLoading) {
              tableBodyContent = (
                <tr>
                  <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                    Cargando...
                  </td>
                </tr>
              );
            } else if (table.getRowModel().rows.length === 0) {
              tableBodyContent = (
                <tr>
                  <td colSpan={columns.length} className="p-4 sm:p-6 text-center text-slate-500 text-sm">
                    No se encontraron registros.
                  </td>
                </tr>
              );
            } else {
              tableBodyContent = table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-sky-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenModal(row.original)}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-slate-700 align-top ${
                        index === 0 ? 'text-left' : 'text-center'
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ));
            }
            return (
              <tbody className="bg-white divide-y divide-sky-50">
                {tableBodyContent}
              </tbody>
            );
          })()}
        </table>
        {/* Paginación responsive */}
        <div className="px-3 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {/* Información de página y selector de tamaño */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-700">Filas por página:</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="px-2 py-1 sm:px-3 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {pageSizeOptions.map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Controles de navegación */}
               <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Primera página"
                  >
                    <MdKeyboardDoubleArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Página anterior"
                  >
                    <MdKeyboardArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-sm text-gray-700 min-w-[120px] text-center">
                    Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                  </span>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Página siguiente"
                  >
                    <MdKeyboardArrowRight className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Última página"
                  >
                    <MdKeyboardDoubleArrowRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
          </div>
        </div>
      </div>


      {/* Modal para ver detalles */}
      {modalOpen && archivoSeleccionado && (
        <CalidadAguaModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          archivo={archivoSeleccionado}
          refetch={refetch}
        />
      )}

      {/* Modal para editar */}
      {editModalOpen && archivoSeleccionado && (
        <CalidadAguaEdit
          archivo={archivoSeleccionado}
          onClose={handleCloseEditModal}
          refetch={refetch}
        />
      )}

      {/* Formulario para crear */}
      {formVisible && (
        <FormularioCalidadAgua
          tituloInicial=""
          onClose={() => setFormVisible(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
}
