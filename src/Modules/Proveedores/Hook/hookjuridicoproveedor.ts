import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getProveedoresJuridicos, 
  getProveedorJuridicoById,
  createProveedorJuridico,
  updateProveedorJuridico,
  deleteProveedorJuridico,
  changeProveedorJuridicoStatus
} from "../Services/juridicoServiceProveedor";
import type { ProveedorJuridico, CreateProveedorJuridicoData, UpdateProveedorJuridicoData } from "../Models/TablaProveedo/proveedorjuridico";

export const useProveedoresJuridicos = () => {
  // Query para obtener todos los proveedores jurídicos
  const {
    data: proveedoresJuridicos = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery<ProveedorJuridico[]>({
    queryKey: ["proveedoresJuridicos"],
    queryFn: getProveedoresJuridicos,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  return {
    proveedoresJuridicos,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useProveedorJuridico = (id: number) => {
  return useQuery({
    queryKey: ['proveedorJuridico', id],
    queryFn: () => getProveedorJuridicoById(id),
    enabled: !!id,
  });
};

export const useCreateProveedorJuridico = () => {
  const queryClient = useQueryClient();
  
  const createMutation = useMutation({
    mutationFn: (data: CreateProveedorJuridicoData) => createProveedorJuridico(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresJuridicos"] });
    },
    onError: (error) => {
      console.error("Error al crear proveedor jurídico:", error);
    },
  });

  return {
    createProveedorJuridico: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    createSuccess: createMutation.isSuccess,
  };
};

export const useUpdateProveedorJuridico = () => {
  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProveedorJuridicoData }) => 
      updateProveedorJuridico(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresJuridicos"] });
      queryClient.invalidateQueries({ queryKey: ["proveedorJuridico", variables.id] });
    },
    onError: (error) => {
      console.error("Error al actualizar proveedor jurídico:", error);
    },
  });

  return {
    updateProveedorJuridico: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    updateSuccess: updateMutation.isSuccess,
  };
};

export const useDeleteProveedorJuridico = () => {
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProveedorJuridico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresJuridicos"] });
    },
    onError: (error) => {
      console.error("Error al eliminar proveedor jurídico:", error);
    },
  });

  return {
    deleteProveedorJuridico: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    deleteSuccess: deleteMutation.isSuccess,
  };
};

export const useChangeProveedorJuridicoStatus = () => {
  const queryClient = useQueryClient();
  
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, nuevoEstado }: { id: number; nuevoEstado: number }) => 
      changeProveedorJuridicoStatus(id, nuevoEstado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proveedoresJuridicos"] });
      queryClient.invalidateQueries({ queryKey: ["proveedorJuridico", variables.id] });
    },
    onError: (error) => {
      console.error("Error al cambiar estado del proveedor jurídico:", error);
    },
  });

  return {
    changeStatus: changeStatusMutation.mutate,
    isChangingStatus: changeStatusMutation.isPending,
    changeStatusError: changeStatusMutation.error,
    changeStatusSuccess: changeStatusMutation.isSuccess,
  };
};
