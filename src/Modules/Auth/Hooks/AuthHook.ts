import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { changePassword, ForgotPassword, getCurrentUser, loginUser, logoutUser, ResetPassword, verifyUser } from '../Services/AuthService'
import type { LoginForm } from '../Models/LoginForm'
import { useState, useEffect } from 'react'
import { cookieUtils } from '../../Global/utils/CookieUtils'
import {  type ChangePassword, type Usuario } from '@/Modules/Usuarios/Models/Usuario'


export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ Nombre_Usuario, Password }: LoginForm) =>
         loginUser({ Nombre_Usuario, Password }),

    onSuccess: () => {
      navigate({ to: '/Home' })
    }
  })
}

export const useForgotPassword = () => {

  return useMutation({
    mutationFn: (email: string) => ForgotPassword(email),

    onSuccess: (res) => {
      return res
    }
  })
}


export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ nuevaContraseña }: { nuevaContraseña: string }) => 
      ResetPassword(nuevaContraseña),

    onSuccess: (res) => {
      return res
    }
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

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => logoutUser(),

    onSuccess: () => {
      navigate({ to: '/Login' })
    },
    onError: () => {
      cookieUtils.removeToken()
      navigate({ to: '/Login' })
    }
  })
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // No verificar autenticación en rutas públicas
    const currentPath = window.location.pathname;
    const publicRoutes = ['/Login', '/ForgotPassword', '/ResetPassword'];
    
    if (publicRoutes.includes(currentPath)) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    const checkAuth = async () => {
      try{
        const isValid = await verifyUser()
        setIsAuthenticated(isValid)
      } catch (error) {
        console.error("Error verifying user:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, isLoading }
}

export const useAuthUser = () => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // No cargar usuario en rutas públicas
    const currentPath = window.location.pathname;
    const publicRoutes = ['/Login', '/ForgotPassword', '/ResetPassword'];
    
    if (publicRoutes.includes(currentPath)) {
      setIsLoading(false);
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  return { user, isLoading }
}