import { useState, useEffect } from "react";
import {getArchivosCalidadAgua,uploadArchivoCalidadAgua,deleteArchivoCalidadAgua,} from "../Service/ServiceCalidadAgua";
import type { ArchivoCalidadAgua } from "../Models/CalidadDeAgua";

export function useCalidadDeAgua() {
  const [archivos, setArchivos] = useState<ArchivoCalidadAgua[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArchivos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getArchivosCalidadAgua();
      setArchivos(data);
    } catch (err) {
      setError("Error al cargar los archivos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivos();
  }, []);

  const subirArchivo = async (Titulo: string, Archivo_Calidad_Agua: File) => {
    setLoading(true);
    setError(null);
    try {
      await uploadArchivoCalidadAgua(Titulo, Archivo_Calidad_Agua);
      await fetchArchivos();
    } catch (err) {
      setError("Error al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarArchivo = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteArchivoCalidadAgua(id);
      await fetchArchivos();
    } catch (err) {
      setError("Error al eliminar el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    archivos,
    loading,
    error,
    fetchArchivos,
    subirArchivo,
    eliminarArchivo,
  };
}