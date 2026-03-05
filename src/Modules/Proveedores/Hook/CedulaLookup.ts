import { useState } from "react"
import { fetchCedulaData, fetchCedulaJuridicaData } from "../Services/CedulaApiService"

export function CedulaLookup() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoadingJuridico, setIsLoadingJuridico] = useState(false)
    const [errorJuridico, setErrorJuridico] = useState<string | null>(null)

    const lookup = async (cedula: string) => {
        setIsLoading(true)
        setError(null)
        try {
            const persona = await fetchCedulaData(cedula)
            return persona
        } catch (err: any) {
            setError(err.message || "Error desconocido")
            return null
        } finally {
            setIsLoading(false)
        }
    }

    const lookupJuridico = async (cedula: string): Promise<string | null> => {
        setIsLoadingJuridico(true)
        setErrorJuridico(null)
        try {
            const nombre = await fetchCedulaJuridicaData(cedula)
            return nombre
        } catch (err: any) {
            setErrorJuridico(err.message || "Error desconocido")
            return null
        } finally {
            setIsLoadingJuridico(false)
        }
    }

    return { lookup, isLoading, error, lookupJuridico, isLoadingJuridico, errorJuridico }
}
