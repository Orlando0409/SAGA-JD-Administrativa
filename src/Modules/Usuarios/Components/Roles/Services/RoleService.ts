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

export const CreateRole = async (roleData: CreateRoleData): Promise<Role> => {
    const response = await axiosPrivate.post("/roles", roleData);
    return response.data;
}
export const UpdateRole = async (roleData: UpdateRoleData): Promise<Role> => {
    const response = await axiosPrivate.put(`/roles/${roleData.Id_Rol}`, roleData);
    return response.data;
}
export const DeleteRole = async (id: number): Promise<void> => {
    await axiosPrivate.delete(`/roles/${id}`);
}
export const GetPermissions = async (): Promise<Permiso[]> => {
    const response = await axiosPrivate.get("/roles/allPermissions");
    return response.data;
}
