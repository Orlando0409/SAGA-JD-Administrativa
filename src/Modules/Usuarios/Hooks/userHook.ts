import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deactivateUser, 
  activateUser
} from '../Services/userService';
import { useAlerts } from '@/Modules/Global/context/AlertContext';
import type { UpdateUserData } from '../Models/Usuario';
import { AxiosError } from 'axios';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario creado', 'El usuario se ha creado exitosamente');
    },
    onError: (error:any) => {
      let errMsg = '';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ Id_Usuario, userData }: { Id_Usuario: number; userData: UpdateUserData }) => updateUser(Id_Usuario, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.Id_Usuario] });
      showSuccess('Usuario actualizado', 'Los datos se han actualizado exitosamente');
    },
    onError: (error:any) => {
      let errMsg = '';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario desactivado', 'El usuario se ha desactivado exitosamente');
    },
    onError: () => {
      showError('Error', 'No se pudo desactivar el usuario');
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError, showWarning } = useAlerts();

  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario activado', 'El usuario se ha activado exitosamente');
    },
    onError: (err: unknown) => {
      let errorMsg = '';
      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      } else {
        errorMsg = String(err);
      }

      if (typeof errorMsg === 'string' && errorMsg.includes('deshabilitado')) {
        showWarning('El rol está deshabilitado. Intenta activar el rol primero.');
      }
      showError('Error, No se pudo activar el usuario');
    },
  });
};
