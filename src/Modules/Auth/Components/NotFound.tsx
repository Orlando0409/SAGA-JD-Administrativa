import { Link } from '@tanstack/react-router';
import { MdErrorOutline } from 'react-icons/md';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="flex flex-col items-center bg-white rounded-xl shadow-lg px-8 py-10">
        <MdErrorOutline className="text-yellow-600 mb-6" size={120} />
        <h1 className="text-yellow-700 text-4xl font-extrabold mb-4 drop-shadow">404 - Página no encontrada</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          La página que buscas no existe o ha sido movida.<br />
          Verifica la URL o regresa al inicio.
        </p>
        <Link
          to="/Home"
          className="mt-2 px-6 py-3 text-base bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-semibold"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;