
import type { UpdateRoleData } from "../Models/Role";
import { GetRoles, GetPermissions, GetRoleById, CreateRole, UpdateRole, deactivateRole, activateRole } from "../Services/RoleService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
    return useMutation({
        mutationFn: CreateRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });
};  

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { Id_Rol: number; roleData: UpdateRoleData }) => UpdateRole(data.Id_Rol, data.roleData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });
};

export const useDeactivateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
};

export const useActivateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
};
