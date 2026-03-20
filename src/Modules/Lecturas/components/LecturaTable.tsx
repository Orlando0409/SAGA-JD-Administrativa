import { useMemo, useState } from "react";
import {
  useGetLecturas,
  useGetLecturasByAfiliado,
  useGetLecturasByMedidor,
  useGetLecturasByUsuario,
  useGetLecturasEntreFechas,
} from "../hook/HookLectura";
import DetailLecturaModal from "./DetailLecturaModal";
import UpdateLecturaModal from "./UpdateLecturaModal";
import { Plus } from "lucide-react";
import { LuFilter } from "react-icons/lu";
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
import InsertarLecturaModal from "./InsertarLecturaModal";
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
import FilterLecturaModal from "./FilterLecturaModal";
import type { LecturaFilterOptions } from "../model/LecturaFilters";
import { useUsers } from "@/Modules/Usuarios/Hooks/userHook";
import { useAfiliadosFisicos } from "@/Modules/Afiliados/Hook/HookAfiliadoFisico";
import { useAfiliadosJuridicos } from "@/Modules/Afiliados/Hook/HookAfiliadoJuridico";

interface FilterSelectOption {
  id: number;
  label: string;
}

type LecturaQuerySource = "all" | "usuario" | "medidor" | "afiliado" | "fechas";

const isPositiveFilter = (value?: number) => (value ?? 0) > 0;

const getActiveQuerySource = (filters: LecturaFilterOptions): LecturaQuerySource => {
  const hasUsuarioFilter = isPositiveFilter(filters.idUsuario);
  const hasMedidorFilter = isPositiveFilter(filters.numeroMedidor);
  const hasAfiliadoFilter = isPositiveFilter(filters.idAfiliado);
  const hasFullDateRangeFilter = Boolean(filters.fechaInicio && filters.fechaFin);

  if (hasFullDateRangeFilter) {
    return "fechas";
  }

  if (hasUsuarioFilter) {
    return "usuario";
  }

  if (hasMedidorFilter) {
    return "medidor";
  }

  if (hasAfiliadoFilter) {
    return "afiliado";
  }

  return "all";
};

const applyClientFilters = (
  data: Lectura[],
  filters: LecturaFilterOptions,
  activeQuerySource: LecturaQuerySource
) => {
  let result = data;
  const hasUsuarioFilter = isPositiveFilter(filters.idUsuario);
  const hasMedidorFilter = isPositiveFilter(filters.numeroMedidor);
  const hasAfiliadoFilter = isPositiveFilter(filters.idAfiliado);
  const hasStartDateFilter = Boolean(filters.fechaInicio);
  const hasEndDateFilter = Boolean(filters.fechaFin);

  if (hasUsuarioFilter && activeQuerySource !== "usuario") {
    result = result.filter((lectura) => lectura.Usuario?.Id_Usuario === filters.idUsuario);
  }

  if (hasMedidorFilter && activeQuerySource !== "medidor") {
    result = result.filter((lectura) => lectura.Medidor?.Numero_Medidor === filters.numeroMedidor);
  }

  if (hasAfiliadoFilter && activeQuerySource !== "afiliado") {
    result = result.filter((lectura) => lectura.Afiliado?.Id_Afiliado === filters.idAfiliado);
  }

  if ((hasStartDateFilter || hasEndDateFilter) && activeQuerySource !== "fechas") {
    const start = hasStartDateFilter
      ? new Date(`${filters.fechaInicio}T00:00:00`).getTime()
      : null;
    const end = hasEndDateFilter
      ? new Date(`${filters.fechaFin}T23:59:59`).getTime()
      : null;

    result = result.filter((lectura) => {
      const lecturaDate = new Date(lectura.Fecha_Lectura).getTime();
      const matchesStart = start === null || lecturaDate >= start;
      const matchesEnd = end === null || lecturaDate <= end;
      return matchesStart && matchesEnd;
    });
  }

  return result;
};

const getActiveFiltersCount = (filters: LecturaFilterOptions) =>
  Object.values(filters).filter((value) => {
    if (typeof value === "number") {
      return value > 0;
    }
    return Boolean(value);
  }).length;

const sortSelectOptions = (a: FilterSelectOption, b: FilterSelectOption) =>
  a.label.localeCompare(b.label, "es", { sensitivity: "base", numeric: true });

const getAfiliadoFisicoLabel = (
  afiliado: {
    readonly Id_Afiliado: number;
    readonly Nombre: string;
    readonly Apellido1?: string;
    readonly Apellido2?: string;
    readonly Primer_Apellido?: string;
    readonly Segundo_Apellido?: string;
  }
) => {
  const primerApellido = afiliado.Apellido1 ?? afiliado.Primer_Apellido ?? "";
  const segundoApellido = afiliado.Apellido2 ?? afiliado.Segundo_Apellido ?? "";

  const nombreCompleto = [afiliado.Nombre, primerApellido, segundoApellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  return nombreCompleto || `Afiliado #${afiliado.Id_Afiliado}`;
};

export default function LecturaTable() {
  const { canCreate, canEdit, canView } = useUserPermissions();

  const hasCreatePermission = canCreate('abonados');
  const hasEditPermission = canEdit('abonados');
  const hasViewPermission = canView('abonados');

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [lecturaSeleccionada, setLecturaSeleccionada] = useState<Lectura | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<LecturaFilterOptions>({});

  const { data: users = [], isLoading: isLoadingUsuarios } = useUsers();
  const { afiliadosFisicos = [], isLoading: isLoadingAfiliadosFisicos } = useAfiliadosFisicos();
  const { afiliadosJuridicos = [], isLoading: isLoadingAfiliadosJuridicos } = useAfiliadosJuridicos();

  const pageSizeOptions = [5, 10, 20, 50];
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  const getNombreAfiliado = (lectura: Lectura): string => {
    const afiliado = lectura.Afiliado;

    if (!afiliado) {
      return "Sin asignar";
    }

    if (afiliado.Tipo_Entidad === 2) {
      return afiliado.Razon_Social?.trim() || afiliado.Cedula_Juridica || `Afiliado jurídico #${afiliado.Id_Afiliado}`;
    }

    const nombreCompleto = [afiliado.Nombre, afiliado.Primer_Apellido, afiliado.Segundo_Apellido]
      .filter(Boolean)
      .join(" ")
      .trim();

    return nombreCompleto || afiliado.Identificacion || `Afiliado #${afiliado.Id_Afiliado}`;
  };

  const activeQuerySource = getActiveQuerySource(appliedFilters);

  const allLecturasQuery = useGetLecturas(activeQuerySource === "all");
  const lecturasUsuarioQuery = useGetLecturasByUsuario(
    appliedFilters.idUsuario ?? 0,
    activeQuerySource === "usuario"
  );
  const lecturasMedidorQuery = useGetLecturasByMedidor(
    appliedFilters.numeroMedidor ?? 0,
    activeQuerySource === "medidor"
  );
  const lecturasAfiliadoQuery = useGetLecturasByAfiliado(
    appliedFilters.idAfiliado ?? 0,
    activeQuerySource === "afiliado"
  );
  const lecturasFechasQuery = useGetLecturasEntreFechas(
    appliedFilters.fechaInicio ?? "",
    appliedFilters.fechaFin ?? "",
    activeQuerySource === "fechas"
  );

  let activeQuery = allLecturasQuery;

  if (activeQuerySource === "fechas") {
    activeQuery = lecturasFechasQuery;
  } else if (activeQuerySource === "usuario") {
    activeQuery = lecturasUsuarioQuery;
  } else if (activeQuerySource === "medidor") {
    activeQuery = lecturasMedidorQuery;
  } else if (activeQuerySource === "afiliado") {
    activeQuery = lecturasAfiliadoQuery;
  }

  const isLoading = activeQuery.isLoading;
  const isError = activeQuery.isError;
  const baseLecturas = activeQuery.data ?? [];

  const lecturas = useMemo(
    () => applyClientFilters(baseLecturas, appliedFilters, activeQuerySource),
    [activeQuerySource, appliedFilters, baseLecturas]
  );

  const activeFiltersCount = useMemo(
    () => getActiveFiltersCount(appliedFilters),
    [appliedFilters]
  );

  const usuarioOptions = useMemo(
    () =>
      users
        .map((user) => ({
          id: user.Id_Usuario,
          label: user.Nombre_Usuario || `Usuario #${user.Id_Usuario}`,
        }))
        .sort(sortSelectOptions),
    [users]
  );

  const afiliadoOptions = useMemo(() => {
    const options: FilterSelectOption[] = [
      ...afiliadosFisicos.map((afiliado) => ({
        id: afiliado.Id_Afiliado,
        label: getAfiliadoFisicoLabel(afiliado),
      })),
      ...afiliadosJuridicos.map((afiliado) => ({
        id: afiliado.Id_Afiliado,
        label: afiliado.Razon_Social?.trim() || `Afiliado #${afiliado.Id_Afiliado}`,
      })),
    ];

    const uniqueById = new Map<number, FilterSelectOption>();
    options.forEach((option) => {
      if (!uniqueById.has(option.id)) {
        uniqueById.set(option.id, option);
      }
    });

    return Array.from(uniqueById.values()).sort(sortSelectOptions);
  }, [afiliadosFisicos, afiliadosJuridicos]);

  const isLoadingAfiliados = isLoadingAfiliadosFisicos || isLoadingAfiliadosJuridicos;


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

  const handleApplyFilters = (filters: LecturaFilterOptions) => {
    setAppliedFilters(filters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  // Column helper
  const columnHelper = createColumnHelper<Lectura>();

  // Definir las columnas
  const columns = [
 
    columnHelper.accessor((row) => row.Medidor.Numero_Medidor, {
      id: "medidor",
      header: "Medidor",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span className="text-gray-700 break-words [overflow-wrap:anywhere]">
            {info.getValue() || "N/A"}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => getNombreAfiliado(row), {
      id: "afiliado",
      header: "Afiliado",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span
            className={`text-sm text-center leading-5 max-w-[220px] break-words [overflow-wrap:anywhere] ${
              info.getValue() === "Sin asignar" ? "text-gray-400 italic" : "text-gray-700"
            }`}
          >
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("Valor_Lectura_Anterior", {
      header: "Lectura Anterior",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span className="text-gray-600 break-words [overflow-wrap:anywhere]">
            {info.getValue()} m³
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("Valor_Lectura_Actual", {
      header: "Lectura Actual",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span className="text-gray-600 font-semibold break-words [overflow-wrap:anywhere]">
            {info.getValue()} m³
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("Consumo_Calculado_M3", {
      header: "Consumo",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span className="text-blue-600 font-semibold break-words [overflow-wrap:anywhere]">
            {info.getValue()} m³
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("Fecha_Lectura", {
      header: "Fecha",
      cell: (info) => (
        <div className="flex justify-center items-center min-w-0">
          <span className="text-gray-600 break-words [overflow-wrap:anywhere]">
            {new Date(info.getValue()).toLocaleDateString("es-ES")}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-[220px]">
          {hasViewPermission && (
            <button
              onClick={() => handleOpenDetailModal(info.row.original)}
              className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              title="Ver detalles"
            >
              Ver
            </button>
          )}
          {hasEditPermission && (
            <button
              onClick={() => handleOpenUpdateModal(info.row.original)}
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      ),
    }),
  ];

  // Configurar la tabla
  const table = useReactTable({
    data: lecturas,
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
    <div className="p-4 sm:p-6">
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
      </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto justify-end mb-4">
            <button
              onClick={() => setShowFilterModal(true)}
              className={`px-4 py-2 border rounded-md flex items-center justify-center gap-2 transition-colors ${
                activeFiltersCount > 0
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
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

            {/* Filtro global */}
            <div className="relative flex-1 sm:max-w-md">
                <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar en todas las columnas..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
            </div>
            {hasCreatePermission && (
              <button
                onClick={handleOpenInsertModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
              >
                <Plus size={20} />
                <span className="break-words [overflow-wrap:anywhere]">Nueva Lectura</span>
              </button>
            )}
        </div>


      {/* Tabla responsive */}
      <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-sky-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-xs sm:text-sm text-sky-700">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-2 sm:px-4 py-3 font-medium border-b border-sky-100 text-center">
                      {(() => {
                        if (header.isPlaceholder) {
                          return null;
                        }

                        if (header.column.getCanSort()) {
                          return (
                            <button
                              type="button"
                              className="cursor-pointer select-none flex items-center justify-center gap-1 bg-transparent border-none p-0 w-full"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="break-words [overflow-wrap:anywhere]">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {header.column.getIsSorted() === 'asc' && <MdKeyboardArrowUp className="inline" />}
                              {header.column.getIsSorted() === 'desc' && <MdKeyboardArrowDown className="inline" />}
                            </button>
                          );
                        }

                        return (
                          <span className="break-words [overflow-wrap:anywhere]">
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                  <td
                    colSpan={columns.length}
                    className="px-2 sm:px-4 py-8 text-center text-slate-500"
                  >
                    {globalFilter || activeFiltersCount > 0
                      ? 'No se encontraron lecturas que coincidan con la búsqueda o filtros aplicados'
                      : 'No hay lecturas registradas'}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-sky-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-slate-700 align-top"
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

      <FilterLecturaModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
        usuarioOptions={usuarioOptions}
        afiliadoOptions={afiliadoOptions}
        isLoadingUsuarios={isLoadingUsuarios}
        isLoadingAfiliados={isLoadingAfiliados}
      />
    </div>
  );
}
