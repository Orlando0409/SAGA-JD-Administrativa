import { useState } from "react";
import { useGetLecturas } from "../hook/HookLectura";
import DetailLecturaModal from "./DetailLecturaModal";
import UpdateLecturaModal from "./UpdateLecturaModal";
import InsertarLecturaModal from "./InsertarLecturaModal";
import { Plus, Eye } from "lucide-react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import type { Lectura } from "../model/Lectura";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";

export default function LecturaTable() {
  const { data: lecturas, isLoading, isError } = useGetLecturas();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState<Lectura | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const handleOpenDetailModal = (lectura: Lectura) => {
    setLecturaSeleccionada(lectura);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setLecturaSeleccionada(null);
  };

  const handleOpenUpdateModal = (lectura: Lectura) => {
    setLecturaSeleccionada(lectura);
    setUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
    setLecturaSeleccionada(null);
  };

  const handleOpenInsertModal = () => {
    setInsertModalOpen(true);
  };

  const handleCloseInsertModal = () => {
    setInsertModalOpen(false);
  };

  // Column helper
  const columnHelper = createColumnHelper<Lectura>();

  // Definir las columnas
  const columns = [
    columnHelper.accessor("Id_Lectura", {
      header: "ID",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.Medidor.Numero_Medidor, {
      id: "medidor",
      header: "Medidor",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-700">{info.getValue() || "N/A"}</span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.Medidor.Afiliado.Nombre_Afiliado, {
      id: "afiliado",
      header: "Afiliado",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-700">{info.getValue() || "N/A"}</span>
        </div>
      ),
    }),
    columnHelper.accessor("Valor_Lectura_Anterior", {
      header: "Lectura Anterior",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-600">{info.getValue()} m³</span>
        </div>
      ),
    }),
    columnHelper.accessor("Valor_Lectura_Actual", {
      header: "Lectura Actual",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-600 font-semibold">{info.getValue()} m³</span>
        </div>
      ),
    }),
    columnHelper.accessor("Consumo_Calculado_M3", {
      header: "Consumo",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-blue-600 font-semibold">{info.getValue()} m³</span>
        </div>
      ),
    }),
    columnHelper.accessor("Fecha_Lectura", {
      header: "Fecha",
      cell: (info) => (
        <div className="flex justify-center items-center">
          <span className="text-gray-600">
            {new Date(info.getValue()).toLocaleDateString("es-ES")}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenDetailModal(info.row.original)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleOpenUpdateModal(info.row.original)}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Editar
          </button>
        </div>
      ),
    }),
  ];

  // Configurar la tabla
  const table = useReactTable({
    data: lecturas || [],
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 p-4">
        Error al cargar las lecturas
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestión de Lecturas
          </h1>
          <p className="text-gray-600 mt-1">
            Administra las lecturas de los medidores
          </p>
        </div>
        <button
          onClick={handleOpenInsertModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Nueva Lectura</span>
        </button>
      </div>

      {/* Filtro global */}
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar en todas las columnas..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span className="text-blue-600">
                          {header.column.getIsSorted() === "asc" ? (
                            <MdKeyboardArrowUp size={20} />
                          ) : (
                            <MdKeyboardArrowDown size={20} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No se encontraron lecturas
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Mostrar:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-700">registros</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardDoubleArrowLeft size={20} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardArrowLeft size={20} />
          </button>
          <span className="text-sm text-gray-700 px-2">
            Página{" "}
            <span>
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardArrowRight size={20} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdKeyboardDoubleArrowRight size={20} />
          </button>
        </div>

      </div>

      {/* Modales */}
      {detailModalOpen && lecturaSeleccionada && (
        <DetailLecturaModal
          lectura={lecturaSeleccionada}
          onClose={handleCloseDetailModal}
        />
      )}

      {updateModalOpen && lecturaSeleccionada && (
        <UpdateLecturaModal
          lectura={lecturaSeleccionada}
          onClose={handleCloseUpdateModal}
        />
      )}

      {insertModalOpen && (
        <InsertarLecturaModal onClose={handleCloseInsertModal} />
      )}
    </div>
  );
}
