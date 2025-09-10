
import { GetRoles, GetPermissions, GetRoleById, CreateRole, UpdateRole } from "../Services/RoleService";
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
        mutationFn: UpdateRole,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        }
    });
};

