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

export const createUser = async (userData: CreateUserData): Promise<Usuario> => {
  const response = await axiosPrivate.post('/usuarios', userData);
  return response.data;
};

export const updateUser = async (Id_Usuario:number, userData: UpdateUserData): Promise<Usuario> => {
  const response = await axiosPrivate.put(`/usuarios/${Id_Usuario}`, userData);
  return response.data;
};

export const deactivateUser = async (id: number): Promise<void> => {
  await axiosPrivate.delete(`/usuarios/${id}`);
};

export const activateUser = async (id: number): Promise<void> => {
  await axiosPrivate.patch(`/usuarios/restaurar/${id}`);
};
