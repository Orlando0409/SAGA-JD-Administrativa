import { LuX, LuFileText, LuUser, LuCalendar, LuActivity, LuDatabase } from 'react-icons/lu';
import type { DetailAuditoriaModalProps } from '../types/AuditoriaTypes';
import DescargarRegistroPdfButton from '@/Modules/Global/components/DescargarPdfModal/DescargarRegistroPdfButton';
import { construirCampos, type CampoAuditoria } from '../utils/auditoriaFormat';

const ACCENTS = {
  red: {
    card: 'bg-red-50 border-red-200',
    title: 'text-red-900',
    dot: 'bg-red-500',
    scroll: 'scrollbar-thumb-red-600 scrollbar-track-red-100',
  },
  green: {
    card: 'bg-green-50 border-green-200',
    title: 'text-green-900',
    dot: 'bg-green-500',
    scroll: 'scrollbar-thumb-green-600 scrollbar-track-green-100',
  },
} as const;

const DatosSection = ({
  titulo,
  campos,
  accent,
}: {
  titulo: string;
  campos: CampoAuditoria[];
  accent: keyof typeof ACCENTS;
}) => {
  const a = ACCENTS[accent];
  return (
    <div className={`p-4 rounded-lg border ${a.card}`}>
      <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${a.title}`}>
        <span className={`size-2 rounded-full ${a.dot}`}></span>
        {titulo}
      </h3>
      <div className={`bg-white rounded p-3 max-h-64 overflow-y-auto scrollbar-thin ${a.scroll}`}>
        <dl className="divide-y divide-gray-100">
          {campos.map((c, i) => (
            <div key={i} className="py-2 first:pt-0 last:pb-0">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                {c.label}
              </dt>
              <dd className="text-sm text-gray-900 mt-0.5 break-words">{c.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

const DetailAuditoriaModal = ({
  auditoria,
  isOpen,
  onClose,
}: DetailAuditoriaModalProps) => {
  if (!isOpen || !auditoria) return null;

  const formatDate = (date: string | Date | null) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleString('es-CR', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'Creación':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Actualización':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Eliminación':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const parseJsonData = (data: string | null) => {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  };

  const camposAnteriores = construirCampos(parseJsonData(auditoria.Datos_Anteriores));
  const camposNuevos = construirCampos(parseJsonData(auditoria.Datos_Nuevos));

  return (
    <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              Detalle de Auditoría
            </h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <LuX className="size-5" />
            </button>
          </div>
        </div>


        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 rounded-lg">
                <LuFileText className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Módulo
                </p>
                <p className="text-base font-semibold text-gray-900 mt-1">
                  {auditoria.Modulo}
                </p>
              </div>
            </div>

            {/* Acción */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 rounded-lg">
                <LuActivity className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Acción
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getAccionColor(
                    auditoria.Accion
                  )}`}
                >
                  {auditoria.Accion}
                </span>
              </div>
            </div>

            {/* Usuario */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2 rounded-lg">
                <LuUser className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Usuario Responsable
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">{auditoria.Usuario?.Nombre_Usuario || 'Desconocido'}</p>
            </div>

                <div className="">
                <p className='text-xs font-medium text-gray-500 uppercase text-center'>Rol</p>
                    <span className="font-medium text-gray-900 mt-1 inline-block px-2 py-0.5 text-xs">
                      {auditoria.Usuario.Nombre_Rol}
                  </span>
                  
              </div>
            </div>

            {/* Fecha */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="p-2">
                <LuCalendar className="size-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Fecha de Acción
                </p>
                <p className="text-base font-medium text-gray-900 mt-1">
                  {formatDate(auditoria.Fecha_Accion)}
                </p>
              </div>
            </div>

            {/* ID Registro */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
              <div className="p-2">
                <LuDatabase className="size-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 uppercase">
                 Registro Afectado
                </p>
                <p className="text-base font-medium text-gray-900 mt-1 break-all">
                  {auditoria.Registro_Afectado}
                </p>
              </div>
            </div>
          </div>

          {/* Datos Anteriores y Nuevos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Datos Anteriores */}
            {camposAnteriores && (
              <DatosSection
                titulo="Datos Anteriores"
                campos={camposAnteriores}
                accent="red"
              />
            )}

            {/* Datos Nuevos */}
            {camposNuevos && (
              <DatosSection
                titulo="Datos Nuevos"
                campos={camposNuevos}
                accent="green"
              />
            )}
          </div>

          {/* Mensaje si no hay datos */}
          {!camposAnteriores && !camposNuevos && (
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                No hay datos de cambios registrados para esta auditoría.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t bg-gray-50 z-10">
          {auditoria?.Id_Auditoria && (
            <DescargarRegistroPdfButton
              endpoint="/auditoria/pdf"
              id={auditoria.Id_Auditoria}
              filenamePrefix="Auditoria"
            />
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailAuditoriaModal;
