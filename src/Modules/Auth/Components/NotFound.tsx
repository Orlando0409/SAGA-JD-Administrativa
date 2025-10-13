// src/Modules/Auth/Components/NotFound.tsx
import { Link } from '@tanstack/react-router';
import { 
  FiHome, 
  FiSearch, 
  FiAlertTriangle,
  FiCompass
} from 'react-icons/fi';
import { 
  HiOutlineEmojiSad,
  HiOutlineLocationMarker
} from 'react-icons/hi';
import { 
  MdErrorOutline,
  MdRefresh
} from 'react-icons/md';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setRotation(prev => prev + 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);


  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className={`max-w-md w-full space-y-8 text-center transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        
        {/* Icono principal animado */}
        <div className="relative">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
          <div className="relative bg-red-50 rounded-full p-6 mx-auto w-32 h-32 flex items-center justify-center">
            <MdErrorOutline 
              className="w-16 h-16 text-red-500" 
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>
          
          {/* Iconos flotantes */}
          <FiCompass className="absolute -top-2 -right-2 w-6 h-6 text-blue-400 animate-bounce delay-100" />
          <HiOutlineLocationMarker className="absolute -bottom-2 -left-2 w-5 h-5 text-green-400 animate-pulse delay-200" />
          <FiSearch className="absolute top-4 -left-4 w-4 h-4 text-yellow-500 animate-spin delay-300" />
        </div>

        {/* Título principal */}
        <div>
          <h1 className="text-9xl font-extrabold text-gray-200 select-none">
            404
          </h1>
          <div className="flex items-center justify-center space-x-2 -mt-4">
            <FiAlertTriangle className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-800">
              ¡Oops! Página no encontrada
            </h2>
            <HiOutlineEmojiSad className="w-6 h-6 text-red-500 animate-bounce" />
          </div>
        </div>

        {/* Sugerencias */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-center space-x-2">
            <FiSearch className="w-5 h-5 text-blue-500" />
            <span>¿Qué puedes hacer?</span>
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Verifica que la URL esté escrita correctamente</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Vuelve al inicio y navega desde allí</span>
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/Home"
              className="group relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <FiHome className="w-5 h-5 group-hover:animate-bounce" />
              <span>Ir al Inicio</span>
            </Link>
            <button
            onClick={handleRefresh}
            className="group w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <MdRefresh className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span>Recargar Página</span>
          </button>
          </div>
          

        </div>

        {/* Información adicional */}
        <div className="pt-8">
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">i</span>
                </div>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  ¿Necesitas ayuda?
                </h4>
                <p className="text-xs text-gray-600">
                  Si continúas teniendo problemas, contacta al administrador del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        </div>
    </div>
  );
};

export default NotFound;