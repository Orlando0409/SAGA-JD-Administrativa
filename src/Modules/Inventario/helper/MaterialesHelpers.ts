import type { Material } from '../models/Inventario';

/**
 * Helper para obtener el estado de loading basado en el filtro de estado
 */
export const getMaterialLoadingState = (
  estadoFilter: string,
  loadingStates: {
    todos: boolean;
    disponibles: boolean;
    agotados: boolean;
    deBaja: boolean;
    agotadosYDeBaja: boolean;
  }
): boolean => {
  switch (estadoFilter) {
    case 'Disponible':
      return loadingStates.disponibles;
    case 'Agotado':
      return loadingStates.agotados;
    case 'De baja':
      return loadingStates.deBaja;
    case 'Agotado y De baja':
      return loadingStates.agotadosYDeBaja;
    default:
      return loadingStates.todos;
  }
};

/**
 * Helper para obtener clases de color según el estado del material
 */
export const getEstadoMaterialColorClass = (estado: string): string => {
  switch (estado) {
    case 'Disponible':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
    case 'Agotado':
      return 'bg-red-100 text-red-700 border border-red-300';
    case 'De baja':
      return 'bg-slate-200 text-slate-700 border border-slate-400';
    case 'Agotado y de baja':
      return 'bg-amber-100 text-amber-700 border border-amber-300';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};

/**
 * Helper para formatear el nombre del proveedor según el tipo
 */
export const getProveedorNombre = (material: Material): string => {
  if (!material?.Proveedor) return 'No especificado';
  
  return material.Proveedor.Id_Tipo_Proveedor === 2
    ? material.Proveedor.Razon_Social || material.Proveedor.Nombre_Proveedor
    : material.Proveedor.Nombre_Proveedor;
};

/**
 * Helper para obtener el tipo de proveedor formateado
 */
export const getProveedorTipo = (idTipoProveedor?: number): string => {
  switch (idTipoProveedor) {
    case 1:
      return 'Físico';
    case 2:
      return 'Jurídico';
    default:
      return 'No especificado';
  }
};

/**
 * Helper para obtener clases de color del badge de tipo de proveedor
 */
export const getProveedorTipoColorClass = (idTipoProveedor?: number): string => {
  switch (idTipoProveedor) {
    case 1:
      return 'bg-blue-100 text-blue-700 border border-blue-300';
    case 2:
      return 'bg-purple-100 text-purple-700 border border-purple-300';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-300';
  }
};
