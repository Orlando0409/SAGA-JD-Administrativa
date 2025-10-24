import type { Permiso, Role, CreateRoleData, UpdateRoleData } from "../Models/Role";
import axiosPrivate from '@/Api/apiAuth';

export const GetRoles = async (): Promise<Role[]> => {
    const response = await axiosPrivate.get("/roles/allRoles");
	return response.data;
}
export const GetRoleById = async (id: number): Promise<Role> => {
    const response = await axiosPrivate.get(`/roles/${id}`);
    return response.data;
}

export const CreateRole = async (roleData: CreateRoleData, idUsuario: number): Promise<Role> => {
    const response = await axiosPrivate.post(`/roles/${idUsuario}`, roleData);
    return response.data;
}
export const UpdateRole = async (Id_Rol:number, roleData: UpdateRoleData, idUsuario: number): Promise<Role> => {
    const response = await axiosPrivate.put(`/roles/${Id_Rol}/${idUsuario}`, roleData);
    return response.data;
}
export const deactivateRole = async (id: number, idUsuario: number): Promise<void> => {
  await axiosPrivate.delete(`/roles/${id}/${idUsuario}`);
};

export const activateRole = async (id: number, idUsuario: number): Promise<void> => {
  await axiosPrivate.patch(`/roles/restore/${id}/${idUsuario}`);
};
export const GetPermissions = async (): Promise<Permiso[]> => {
    const response = await axiosPrivate.get("/roles/allPermissions");
    return response.data;
}
