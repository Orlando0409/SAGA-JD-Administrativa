import React, { useState } from 'react';
import type { ContactoItem } from './ContactoTable';
import { LuX } from 'react-icons/lu';
import { useResponderContacto } from '../hook/HookContacto';

interface ResponderModalProps {
    item: ContactoItem;
    isOpen: boolean;
    onClose: () => void;
}

const ResponderModal: React.FC<ResponderModalProps> = ({ item, isOpen, onClose }) => {
  const [respuesta, setRespuesta] = useState('');
  const {
    sendRespuesta,
    isLoading,
    errorMsg,
    successMsg,
    resetFeedback,
  } = useResponderContacto(item);

  if (!isOpen) return null;

  const handleSendResponse = () => {
    if (!respuesta.trim()) {
      // El hook maneja el error, pero puedes mostrarlo aquí si prefieres
      return;
    }
    sendRespuesta(respuesta, () => {
      setRespuesta('');
      setTimeout(() => {
        resetFeedback();
        onClose();
      }, 1200);
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Responder a {item.tipo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors absolute top-6 right-6"
          >
            <LuX size={20} />
          </button>
        </div>
        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">De:</h3>
            <p className="text-gray-600">{item.nombre} &lt;{item.correo}&gt;</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-2">Mensaje:</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{item.mensaje}</p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Responder</h3>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2"
            rows={4}
            placeholder="Escribe tu respuesta aquí..."
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
            disabled={isLoading}
          />
          {errorMsg && <div className="text-red-600 mt-2 text-sm">{errorMsg}</div>}
          {successMsg && <div className="text-green-600 mt-2 text-sm">{successMsg}</div>}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={handleSendResponse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Respuesta'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponderModal