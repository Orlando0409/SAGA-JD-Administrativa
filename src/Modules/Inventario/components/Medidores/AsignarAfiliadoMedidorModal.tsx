import { useState, useEffect, useMemo } from 'react';
import { LuX, LuSearch, LuUserCheck, LuUser } from 'react-icons/lu';
import { FaTachometerAlt } from 'react-icons/fa';
import type { AsignarAfiliadoMedidorModalProps } from '../../types/MedidorTypes';
import { asignarMedidorAAfiliado } from '../../service/MedidorServices';
import { getAfiliadosFisicos } from '@/Modules/Afiliados/Service/ServiceAfiliadoFisico';
import type { AfiliadoFisico } from '@/Modules/Afiliados/Models/TablaAfiliados/ModeloAfiliadoFisico';

interface AfiliadoOpcion {
  Id_Afiliado: number;
  nombre: string;
  identificacion: string;
  correo?: string;
}

const AsignarAfiliadoMedidorModal = ({
  isOpen,
  onClose,
  medidor,
  onSuccess,
}: AsignarAfiliadoMedidorModalProps) => {
  const [afiliados, setAfiliados] = useState<AfiliadoOpcion[]>([]);
  const [loadingAfiliados, setLoadingAfiliados] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAfiliado, setSelectedAfiliado] = useState<AfiliadoOpcion | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingAfiliados(true);
    setErrorMsg(null);
    setSelectedAfiliado(null);
    setSearchTerm('');
    setSuccessMsg(null);

    getAfiliadosFisicos()
      .then((data: AfiliadoFisico[]) => {
        const lista: AfiliadoOpcion[] = data.map((a) => ({
          Id_Afiliado: a.Id_Afiliado,
          nombre: `${a.Nombre} ${a.Apellido1} ${a.Apellido2 ?? ''}`.trim(),
          identificacion: a.Identificacion,
          correo: a.Correo,
        }));
        setAfiliados(lista);
      })
      .catch(() => setErrorMsg('Error al cargar los afiliados.'))
      .finally(() => setLoadingAfiliados(false));
  }, [isOpen]);

  const afiliadosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return afiliados;
    const term = searchTerm.toLowerCase();
    return afiliados.filter(
      (a) =>
        a.nombre.toLowerCase().includes(term) ||
        a.identificacion.toLowerCase().includes(term) ||
        (a.correo ?? '').toLowerCase().includes(term)
    );
  }, [afiliados, searchTerm]);

  const handleConfirmar = async () => {
    if (!selectedAfiliado) return;
    setGuardando(true);
    setErrorMsg(null);
    try {
      await asignarMedidorAAfiliado(medidor.Id_Medidor, selectedAfiliado.Id_Afiliado);
      setSuccessMsg(
        `Medidor #${medidor.Numero_Medidor} asignado correctamente a ${selectedAfiliado.nombre}.`
      );
      onSuccess?.();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Ocurrió un error al asignar el medidor.';
      setErrorMsg(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaTachometerAlt className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Asignar a Afiliado</h2>
              <p className="text-sm text-gray-500">
                Medidor <span className="font-semibold text-blue-700">#{medidor.Numero_Medidor}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            disabled={guardando}
          >
            <LuX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Info medidor */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
            <p>
              <span className="font-semibold">Estado:</span>{' '}
              {medidor.Estado_Medidor.Nombre_Estado_Medidor}
            </p>
            <p>
              <span className="font-semibold">Afiliado actual:</span>{' '}
              {medidor.Afiliado ? 'Asignado' : 'Sin afiliado asignado'}
            </p>
          </div>

          {/* Buscar afiliado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar afiliado
            </label>
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nombre, cédula o correo..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedAfiliado(null);
                }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista de afiliados */}
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
            {loadingAfiliados ? (
              <div className="flex items-center justify-center py-8 gap-2 text-gray-500 text-sm">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                Cargando afiliados...
              </div>
            ) : afiliadosFiltrados.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No se encontraron afiliados
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {afiliadosFiltrados.map((a) => (
                  <li key={a.Id_Afiliado}>
                    <button
                      type="button"
                      onClick={() => setSelectedAfiliado(a)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                        selectedAfiliado?.Id_Afiliado === a.Id_Afiliado
                          ? 'bg-blue-100 border-l-4 border-blue-500'
                          : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <LuUser className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 truncate">{a.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">{a.identificacion}</p>
                      </div>
                      {selectedAfiliado?.Id_Afiliado === a.Id_Afiliado && (
                        <LuUserCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Afiliado seleccionado */}
          {selectedAfiliado && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-800 flex items-center gap-1">
                <LuUserCheck className="w-4 h-4" /> Afiliado seleccionado
              </p>
              <p className="text-blue-700 mt-1">
                {selectedAfiliado.nombre}{' '}
                <span className="text-blue-500">({selectedAfiliado.identificacion})</span>
              </p>
            </div>
          )}

          {/* Mensajes */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
              {successMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!selectedAfiliado || guardando}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Asignando...
              </>
            ) : (
              <>
                <LuUserCheck className="w-4 h-4" />
                Confirmar Asignación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarAfiliadoMedidorModal;
