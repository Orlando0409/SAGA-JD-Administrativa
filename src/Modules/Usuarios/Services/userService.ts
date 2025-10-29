import axiosPrivate from '@/Api/apiAuth';
import type { CreateUserData, UpdateUserData, Usuario } from '../Models/Usuario';



export const getAllUsers = async (): Promise<Usuario[]> => {
  const response = await axiosPrivate.get('/usuarios');
  return response.data;
};

export const getUserById = async (id: number): Promise<Usuario> => {
  const response = await axiosPrivate.get(`/usuarios/${id}`);
  return response.data;
};

export const createUser = async (userData: CreateUserData, idUsuario: number): Promise<Usuario> => {
  const response = await axiosPrivate.post(`/usuarios/${idUsuario}`, userData);
  return response.data;
};

export const updateUser = async (Id_Usuario:number,idUsuario: number, userData: UpdateUserData): Promise<Usuario> => {
  const response = await axiosPrivate.put(`/usuarios/${Id_Usuario}/${idUsuario}`, userData);
  return response.data;
};

export const deactivateUser = async (id: number, idUsuario: number): Promise<void> => {
  await axiosPrivate.delete(`/usuarios/${id}/${idUsuario}`);
};

export const activateUser = async (id: number, idUsuario: number): Promise<void> => {
  await axiosPrivate.patch(`/usuarios/restaurar/${id}/${idUsuario}`);
};
