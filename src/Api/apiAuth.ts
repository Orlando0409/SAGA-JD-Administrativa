import axios from 'axios'
import { cookieUtils } from '../utils/CookieUtils'

const axiosPrivate = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Las cookies se envían automáticamente
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

axiosPrivate.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const currentPath = window.location.pathname;
    const publicRoutes = ['/Login', '/ForgotPassword', '/ResetPassword'];

    // No manejar errores 401 en rutas públicas
    if (publicRoutes.includes(currentPath)) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(() => axiosPrivate(originalRequest))
          .catch(err => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // Solo llama al refresh, las cookies se actualizan automáticamente
        await axiosPrivate.post('/auth/refresh')
        processQueue(null)
        return axiosPrivate(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        cookieUtils.removeToken()
        window.location.href = '/Login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosPrivate