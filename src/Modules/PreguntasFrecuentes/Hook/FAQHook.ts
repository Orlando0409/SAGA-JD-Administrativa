import { useState, useEffect } from "react";

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
