import React from 'react';
import { useDeleteProveedorFisico } from '../Hook/hookFisicoProveedor';

interface DeleteProveedorButtonProps {
  proveedorId: number;
  proveedorNombre: string;
  onDeleteSuccess?: () => void;
}

const DeleteProveedorButton: React.FC<DeleteProveedorButtonProps> = ({ 
  proveedorId, 
  proveedorNombre,
  onDeleteSuccess 
}) => {
  const { 
    deleteProveedorFisico, 
    isDeleting
  } = useDeleteProveedorFisico();

  const handleDelete = async () => {
    // Confirmar eliminación
    const confirmed = window.confirm(
      `¿Está seguro que desea eliminar al proveedor "${proveedorNombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      await deleteProveedorFisico(proveedorId);
      alert(`Proveedor "${proveedorNombre}" eliminado exitosamente`);
      
      // Callback opcional para acciones adicionales
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al eliminar el proveedor: ${errorMessage}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        isDeleting
          ? 'bg-red-300 text-red-800 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 text-white'
      }`}
      title={`Eliminar proveedor ${proveedorNombre}`}
    >
      {isDeleting ? (
        <>
          <span className="animate-spin inline-block w-3 h-3 border border-red-800 border-t-transparent rounded-full mr-1"></span>
          Eliminando...
        </>
      ) : (
        '🗑️ Eliminar'
      )}
    </button>
  );
};

export default DeleteProveedorButton;