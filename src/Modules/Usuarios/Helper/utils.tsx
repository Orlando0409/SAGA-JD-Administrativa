import type { FechaEliminacionType } from "../Types/UserTypes";


export const isActive = (Fecha_Eliminacion: FechaEliminacionType) => {
  return Fecha_Eliminacion === null || Fecha_Eliminacion === undefined;
};

export const getStatusDisplay = (Fecha_Eliminacion: FechaEliminacionType) => {
  return isActive(Fecha_Eliminacion) ? 'Activo' : 'Inactivo';
};

export const getStatusClass = (Fecha_Eliminacion: FechaEliminacionType) => {
  return isActive(Fecha_Eliminacion)
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
};

export const NombreUsuarioCell: React.FC<{ value: string }> = ({ value }) => (
  <span className="font-medium text-gray-900">
    {value}
  </span>
);


