import { useState, useEffect } from "react";
import { getArchivosCalidadAgua, uploadArchivoCalidadAgua, deleteArchivoCalidadAgua } from "../Service/ServiceCalidadAgua";
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

  const subirArchivo = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      await uploadArchivoCalidadAgua(formData);
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

  useEffect(() => {
    fetchArchivos();
  }, []);

  return {
    archivos,
    loading,
    error,
    fetchArchivos,
    subirArchivo,
    eliminarArchivo,
  };
}