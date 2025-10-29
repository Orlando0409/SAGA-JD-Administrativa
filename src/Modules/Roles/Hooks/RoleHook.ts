
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import type { CreateRoleData, UpdateRoleData } from "../Models/Role";
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
        mutationFn: ({ roleData, idUsuario }: { roleData: CreateRoleData; idUsuario: number }) => CreateRole(roleData, idUsuario),
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
        mutationFn: (data: { Id_Rol: number; roleData: UpdateRoleData, idUsuario: number }) => UpdateRole(data.Id_Rol, data.roleData, data.idUsuario),
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
  const { showSuccessWithUndo, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, idUsuario }: { id: number; idUsuario: number }) => deactivateRole(id, idUsuario),
    onSuccess: (_, roleId) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
      const undoAction = async () => {
        try {
          await activateRole(roleId.id, roleId.idUsuario);
          queryClient.invalidateQueries({ queryKey: ['roles'] });
        } catch (error) {
          showError('Error', 'No se pudo revertir el cambio');
          console.error('Error activating role in undo action:', error);
        }
      };

      showSuccessWithUndo(
        'Rol desactivado', 
        'El rol se ha desactivado exitosamente',
        undoAction
      );
    },
    onError: () => {
      showError("Error, No se pudo desactivar el rol");
    }
  });
};

export const useActivateRole = () => {
  const queryClient = useQueryClient();
  const { showSuccessWithUndo, showError } = useAlerts();
  return useMutation({
    mutationFn: ({ id, idUsuario }: { id: number; idUsuario: number }) => activateRole(id, idUsuario),
    onSuccess: (_, roleData) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
      const undoAction = async () => {
        try {
          await deactivateRole(roleData.id, roleData.idUsuario);
          queryClient.invalidateQueries({ queryKey: ['roles'] });
        } catch (error) {
          showError('Error', 'No se pudo revertir el cambio');
          console.error('Error deactivating role in undo action:', error);
        }
      };

      showSuccessWithUndo(
        'Rol activado', 
        'El rol se ha activado exitosamente',
        undoAction
      );
    },
    onError: () => {
      showError("Error, No se pudo activar el rol");
    }
  });
};
