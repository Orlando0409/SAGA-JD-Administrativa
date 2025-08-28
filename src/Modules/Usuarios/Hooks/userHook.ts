// src/hooks/useCurrentUser.ts
import { useState, useEffect } from 'react'
import { cookieUtils } from '../../../utils/CookieUtils'

interface User {
  name: string
  email: string
  avatar?: string
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Aquí harías una llamada a tu API para obtener los datos del usuario
        // const response = await axiosPrivate.get('/auth/me')
        // setUser(response.data)
        
        // Por ahora, datos de ejemplo
        if (cookieUtils.hasToken()) {
          setUser({
            name: 'Orlando Baltodano',
            email: 'orlando@asada.com'
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}