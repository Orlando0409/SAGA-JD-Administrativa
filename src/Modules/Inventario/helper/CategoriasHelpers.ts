/**
 * Helper para obtener el estado de loading basado en el filtro de estado de categorías
 */
export const getCategoriasLoadingState = (
  estadoFilter: string,
  loadingStates: {
    todas: boolean;
    activas: boolean;
    inactivas: boolean;
  }
): boolean => {
  switch (estadoFilter) {
    case 'Activa':
      return loadingStates.activas;
    case 'Inactiva':
      return loadingStates.inactivas;
    default:
      return loadingStates.todas;
  }
};

/**
 * Helper para obtener el estado de error basado en el filtro de estado de categorías
 */
export const getCategoriasErrorState = (
  estadoFilter: string,
  errorStates: {
    todas: Error | null;
    activas: Error | null;
    inactivas: Error | null;
  }
): Error | null => {
  switch (estadoFilter) {
    case 'Activa':
      return errorStates.activas;
    case 'Inactiva':
      return errorStates.inactivas;
    default:
      return errorStates.todas;
  }
};
