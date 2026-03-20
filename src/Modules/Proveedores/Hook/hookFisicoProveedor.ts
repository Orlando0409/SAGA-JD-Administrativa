import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  
  const createMutation = useMutation({
    mutationFn: (data: CreateProveedorData) => createProveedorFisico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
     
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al crear el proveedor físico';
      console.error('Error', errorMessage);
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
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProveedorData }) => 
      updateProveedorFisico(id, data),
    onSuccess: (updatedProveedor, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.setQueryData(['proveedorFisico', id], updatedProveedor);
      
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al actualizar el proveedor físico';
      console.error('Error', errorMessage);
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

  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProveedorFisico(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.removeQueries({ queryKey: ['proveedorFisico', deletedId] });
      
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al eliminar el proveedor físico';
      console.error('Error', errorMessage);
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

  
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: number; nuevoEstado: number }) => 
      changeProveedorFisicoStatus(id, nuevoEstado),
    onSuccess: (updatedProveedor, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresFisicos"] });
      queryClient.setQueryData(['proveedorFisico', id], updatedProveedor);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error al cambiar el estado del proveedor físico';
      console.error("Error al cambiar estado del proveedor físico:", errorMessage);
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