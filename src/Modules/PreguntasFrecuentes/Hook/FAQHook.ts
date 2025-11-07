import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import {
  getFAQ,
  getFAQAdmin,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQVisible,
} from "../Services/FAQService";
import type { FAQ } from "../Models/FAQModels";
import { AxiosError } from "axios";

// Hook con React Query para obtener todas las FAQs
export const useFAQs = (isAdmin: boolean = false) => {
  return useQuery({
    queryKey: ['faqs', isAdmin],
    queryFn: () => isAdmin ? getFAQAdmin() : getFAQ(),
  });
};

// Hook con React Query para obtener una FAQ por ID
export const useFAQById = (id: number) => {
  return useQuery({
    queryKey: ['faq', id],
    queryFn: () => getFAQById(id),
    enabled: !!id,
  });
};

// Hook para crear una FAQ
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: (data: Partial<FAQ>) => createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      showSuccess('Pregunta creada', 'La pregunta frecuente se ha creado exitosamente');
    },
    onError: (error: any) => {
      let errMsg = 'Error al crear la pregunta frecuente';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

// Hook para actualizar una FAQ
export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<FAQ> }) => updateFAQ(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      queryClient.invalidateQueries({ queryKey: ['faq', variables.id] });
      showSuccess('Pregunta actualizada', 'Los cambios se han guardado exitosamente');
    },
    onError: (error: any) => {
      let errMsg = 'Error al actualizar la pregunta frecuente';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

// Hook para eliminar una FAQ
export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: (id: number) => deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      showSuccess('Pregunta eliminada', 'La pregunta frecuente se ha eliminado exitosamente');
    },
    onError: (error: any) => {
      let errMsg = 'Error al eliminar la pregunta frecuente';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

// Hook para cambiar visibilidad de una FAQ
export const useToggleFAQVisible = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlerts();

  return useMutation({
    mutationFn: (id: number) => toggleFAQVisible(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      showSuccess('Visibilidad actualizada correctamente');
    },
    onError: (error: any) => {
      let errMsg = 'Error al cambiar la visibilidad';
      if (error instanceof AxiosError) {
        errMsg = error.response?.data?.message || error.message;
      }
      showError('Error', errMsg);
    },
  });
};

// Hook legacy para compatibilidad con código existente
export const useFAQ = (isAdmin: boolean = false) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener todas las FAQs
  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await getFAQAdmin() : await getFAQ();
      setFaqs(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las preguntas frecuentes.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener una FAQ por ID
  const fetchById = async (id: number) => {
    try {
      setLoading(true);
      const data = await getFAQById(id);
      setFaq(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar la FAQ.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear una nueva FAQ
  const addFAQ = async (data: Partial<FAQ>) => {
    try {
      setLoading(true);
      const newFAQ = await createFAQ(data);
      setFaqs((prev) => [...prev, newFAQ]);
    } catch (err) {
      console.error(err);
      setError("Error al crear la pregunta frecuente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Actualizar una FAQ
  const editFAQ = async (id: number, data: Partial<FAQ>) => {
    try {
      setLoading(true);
      const updated = await updateFAQ(id, data);
      setFaqs((prev) => prev.map((f) => (f.Id_FAQ === id ? updated : f)));
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la pregunta frecuente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar una FAQ
  const removeFAQ = async (id: number) => {
    try {
      setLoading(true);
      await deleteFAQ(id);
      setFaqs((prev) => prev.filter((f) => f.Id_FAQ !== id));
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la pregunta frecuente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cambiar visibilidad
  const toggleVisible = async (id: number) => {
    try {
      setLoading(true);
      const updated = await toggleFAQVisible(id);
      setFaqs((prev) =>
        prev.map((f) => (f.Id_FAQ === id ? { ...f, Visible: updated.Visible } : f))
      );
    } catch (err) {
      console.error(err);
      setError("Error al cambiar la visibilidad.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar FAQs automáticamente al iniciar
  useEffect(() => {
    fetchAll();
  }, [isAdmin]);

  return {
    faqs,
    faq,
    loading,
    error,
    fetchAll,
    fetchById,
    addFAQ,
    editFAQ,
    removeFAQ,
    toggleVisible,
  };
};
