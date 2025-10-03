
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { UpdateRoleData } from "../Models/Role";
import { GetRoles, GetPermissions, GetRoleById, CreateRole, UpdateRole, deactivateRole, activateRole } from "../Services/RoleService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: GetRoles
    });
};

export const usePermissions = () => {
    return useQuery({
        queryKey: ['permissions'],
        queryFn: GetPermissions
    });
};
export const useRoleById = (id: number) => {
    return useQuery({
        queryKey: ['role', id],
        queryFn: () => GetRoleById(id)
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();
    return useMutation({
        mutationFn: CreateRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            showSuccess('Rol creado', 'El rol se ha creado exitosamente');
        },
        onError: (error:any) => {
            let errMsg = '';
            if (error instanceof AxiosError) {
                errMsg = error.response?.data?.message || error.message;
            }
            showError('Error', errMsg);
        }
    });
};  

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();
    return useMutation({
        mutationFn: (data: { Id_Rol: number; roleData: UpdateRoleData }) => UpdateRole(data.Id_Rol, data.roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
            showSuccess('Rol actualizado', 'El rol se ha actualizado exitosamente');
        },
        onError: (error:any) => {
            let errMsg = '';
            if (error instanceof AxiosError) {
                errMsg = error.response?.data?.message || error.message;
            }
            showError('Error', errMsg);
        }
    });
};

export const useDeactivateRole = () => {
  const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showSuccess('Rol desactivado', 'El rol se ha desactivado exitosamente');
    },
    onError: () => {
      showError("Error, No se pudo desactivar el rol");
    }
  });
};

export const useActivateRole = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();
  return useMutation({
    mutationFn: activateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showSuccess('Rol activado', 'El rol se ha activado exitosamente');
    },
    onError: () => {
      showError("Error, No se pudo activar el rol");
    }
  });
};
