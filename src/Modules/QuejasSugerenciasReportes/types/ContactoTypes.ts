// src/Modules/QuejasSugerenciasReportes/types/ContactoTypes.ts

export type TipoContacto = 'Queja' | 'Sugerencia' | 'Reporte';
export type EstadoContacto = 'Pendiente' | 'En Proceso' | 'Resuelto';

export interface ContactoFilterOptions {
  tipo?: TipoContacto;
  estado?: EstadoContacto;
  fechaInicio?: string;
  fechaFin?: string;
  conAdjunto?: boolean;
  soloConNombre?: boolean;
  soloSinNombre?: boolean;
}

export interface FilterContactoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: ContactoFilterOptions) => void;
  currentFilters: ContactoFilterOptions;
}
