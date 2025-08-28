import Cookies from 'js-cookie'

export const cookieUtils = {
  // Obtener token (lee la cookie que setea el backend)
  getToken: (): string | undefined => {
    return Cookies.get('accessToken') 
  },

  // Eliminar token (para logout)
  removeToken: () => {
    Cookies.remove('accessToken')
  },

  // Verificar si existe token
  hasToken: (): boolean => {
    return !!Cookies.get('accessToken')
  }
}