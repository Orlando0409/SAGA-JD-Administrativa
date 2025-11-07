import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { 
  getProveedoresFisicos, 
  getProveedorFisicoById,
  createProveedorFisico,
  updateProveedorFisico,
  deleteProveedorFisico,
  changeProveedorFisicoStatus
} from "../Services/fisicoServiceProveedor";
import type { ProveedorFisico, CreateProveedorData, UpdateProveedorData } from "../Models/TablaProveedo/tablaFisicoProveedor";

export const useProveedoresFisicos = () => {
  // Query para obtener todos los proveedores físicos
  const {
    data: proveedoresFisicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ProveedorFisico[]>({
    queryKey: ["proveedoresFisicos"],
    queryFn: getProveedoresFisicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return {
    proveedoresFisicos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useProveedorFisico = (id: number) => {
  return useQuery({
    queryKey: ['proveedorFisico', id],
    queryFn: () => getProveedorFisicoById(id),
    enabled: !!id,
  });
};

export const useCreateProveedorFisico = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  const createMutation = useMutation({
    mutationFn: (data: CreateProveedorData) => createProveedorFisico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      showSuccess('Proveedor creado', 'El proveedor físico se ha creado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear el proveedor físico';
      showError('Error', errorMessage);
    },
  });
   
  return {
    createProveedorFisico: createMutation.mutateAsync,
    createProveedorFisicoSync: createMutation.mutate,
    isCreating: createMutation.isPending,
    isError: createMutation.isError,
    error: createMutation.error,
    isSuccess: createMutation.isSuccess,
  };
};

export const useUpdateProveedorFisico = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProveedorData }) => 
      updateProveedorFisico(id, data),
    onSuccess: (updatedProveedor, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.setQueryData(['proveedorFisico', id], updatedProveedor);
      showSuccess('Proveedor actualizado', 'El proveedor físico se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el proveedor físico';
      showError('Error', errorMessage);
    },
  });
   
  return {
    updateProveedorFisico: updateMutation.mutateAsync,
    updateProveedorFisicoSync: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isError: updateMutation.isError,
    error: updateMutation.error,
    isSuccess: updateMutation.isSuccess,
  };
};

export const useDeleteProveedorFisico = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProveedorFisico(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.removeQueries({ queryKey: ['proveedorFisico', deletedId] });
      showSuccess('Proveedor eliminado', 'El proveedor físico se ha eliminado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el proveedor físico';
      showError('Error', errorMessage);
    },
  });
   
  return {
    deleteProveedorFisico: deleteMutation.mutateAsync,
    deleteProveedorFisicoSync: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error,
    isSuccess: deleteMutation.isSuccess,
  };
};

// Hook para cambiar el estado de un proveedor físico (Activo/Inactivo)
export const useChangeProveedorFisicoStatus = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: number; nuevoEstado: number }) => 
      changeProveedorFisicoStatus(id, nuevoEstado),
    onSuccess: (updatedProveedor, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.setQueryData(['proveedorFisico', id], updatedProveedor);
      showSuccess('Estado actualizado', 'El estado del proveedor se ha actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al cambiar el estado del proveedor físico';
      showError('Error', errorMessage);
    },
  });
   
  return {
    changeStatus: changeStatusMutation.mutateAsync,
    changeStatusSync: changeStatusMutation.mutate,
    isChangingStatus: changeStatusMutation.isPending,
    isError: changeStatusMutation.isError,
    error: changeStatusMutation.error,
    isSuccess: changeStatusMutation.isSuccess,
  };
};