import { useState, useCallback } from "react";
import { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";
import { getArchivosCalidadAgua, uploadArchivoCalidadAgua, deleteArchivoCalidadAgua, updateArchivoCalidadAgua } from "../Service/ServiceCalidadAgua";

export function useCalidadDeAgua() {
    const [archivos, setArchivos] = useState<ArchivoCalidadAgua[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchArchivos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const archivosData = await getArchivosCalidadAgua();
            setArchivos(archivosData);
        } catch (err) {
            setError("Error al cargar los archivos.");
        } finally {
            setLoading(false);
        }
    }, []); // Memoiza la función para que no cambie su referencia

    const subirArchivo = async (formData: FormData): Promise<ArchivoCalidadAgua> => {
        try {
            const nuevoArchivo = await uploadArchivoCalidadAgua(formData);
            setArchivos((prevArchivos) => [...prevArchivos, nuevoArchivo]);
            return nuevoArchivo;
        } catch (err) {
            throw new Error("Error al subir el archivo.");
        }
    };
   const eliminarArchivo = async (id: number): Promise<void> => {
        try {
            await deleteArchivoCalidadAgua(id); // Llama al servicio para eliminar el archivo
            setArchivos((prevArchivos) => prevArchivos.filter((archivo) => archivo.Id_Calidad_Agua !== id)); // Actualiza el estado
        } catch (err) {
            console.error("Error al eliminar el archivo:", err);
            throw new Error("Error al eliminar el archivo.");
        }
    };


    const reemplazarArchivo = async (id: number, formData: FormData): Promise<ArchivoCalidadAgua> => {
        try {
            const archivoActualizado = await updateArchivoCalidadAgua(id, formData);
            setArchivos((prevArchivos) =>
                prevArchivos.map((archivo) =>
                    archivo.Id_Calidad_Agua === id ? archivoActualizado : archivo
                )
            );
            return archivoActualizado;
        } catch (err) {
            throw new Error("Error al reemplazar el archivo.");
        }
    };

    return { archivos, loading, error, fetchArchivos, subirArchivo, eliminarArchivo, reemplazarArchivo };
}