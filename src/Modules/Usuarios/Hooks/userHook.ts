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
    onError: () => {
      showError('Error', 'No se pudo crear el usuario');
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
    onError: () => {
      showError('Error', 'No se pudo actualizar el usuario');
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
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccess('Usuario activado', 'El usuario se ha activado exitosamente');
    },
    onError: () => {
      showError('Error', 'No se pudo activar el usuario');
    },
  });
};
