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

    // Si el error es 401 y no es el endpoint de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Espera a que el refresh termine
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axiosPrivate(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      isRefreshing = true

      try {
        // Llama al endpoint de refresh
        const refreshResponse = await axiosPrivate.post('/auth/refresh')
        const newAccessToken = refreshResponse.data.accessToken

        processQueue(null, newAccessToken)
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
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