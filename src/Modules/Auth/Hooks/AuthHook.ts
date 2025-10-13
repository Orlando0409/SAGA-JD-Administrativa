import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { changePassword, ForgotPassword, loginUser, logoutUser, ResetPassword } from '../Services/AuthService'
import type { LoginForm } from '../Models/LoginForm'
import { cookieUtils } from '../../Global/utils/CookieUtils'
import { type ChangePassword } from '@/Modules/Usuarios/Models/Usuario'
import { useAuth } from '../Context/AuthContext'

export const useLogin = () => {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: ({ Nombre_Usuario, Password }: LoginForm) =>
         loginUser({ Nombre_Usuario, Password }),

    onSuccess: async () => {
      await refreshUser(); 
      navigate({ to: '/Home' })
    }
  })
}

export const useLogout = () => {

  return useMutation({
    mutationFn: () => logoutUser(),

    onSuccess: () => {
      window.location.href = '/Login'; 
    },
    onError: () => {
      cookieUtils.removeToken()
      window.location.href = '/Login';
    }
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ Email }: { Email: string }) => ForgotPassword( Email )
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ nuevaContraseña }: { nuevaContraseña: string }) =>
      ResetPassword(nuevaContraseña )
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ UsuarioId, Contraseña_Actual, Nueva_Contraseña }: ChangePassword) =>
      changePassword({ UsuarioId, Contraseña_Actual, Nueva_Contraseña }),
    onSuccess: (res) => {
      return res
    }
  })
}