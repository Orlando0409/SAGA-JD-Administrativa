import type { MovimientoFilterOptions } from '../types/MovimientosTypes';

/**
 * Helper para obtener el estado de loading basado en los filtros de movimientos
 */
export const getMovimientosLoadingState = (
  filters: MovimientoFilterOptions,
  hasFechas: boolean,
  loadingStates: {
    todos: boolean;
    entradas: boolean;
    salidas: boolean;
    fechas: boolean;
  }
): boolean => {
  if (hasFechas) return loadingStates.fechas;
  if (filters.soloIngresos) return loadingStates.entradas;
  if (filters.soloEgresos) return loadingStates.salidas;
  return loadingStates.todos;
};

/**
 * Helper para obtener el estado de error basado en los filtros de movimientos
 */
export const getMovimientosErrorState = (
  filters: MovimientoFilterOptions,
  hasFechas: boolean,
  errorStates: {
    todos: Error | null;
    entradas: Error | null;
    salidas: Error | null;
    fechas: Error | null;
  }
): Error | null => {
  if (hasFechas) return errorStates.fechas;
  if (filters.soloIngresos) return errorStates.entradas;
  if (filters.soloEgresos) return errorStates.salidas;
  return errorStates.todos;
};
