// src/Modules/Solicitudes/Components/BuzonNotificaciones.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { LuBell, LuX, LuEye, LuUnplug, LuNotebookText, LuClock, LuUser, LuBuilding, LuMessageSquare, LuLightbulb, LuFileText } from 'react-icons/lu';
import { useNotificacionesSolicitudes, type NotificacionSolicitud } from '../Hooks/HookNotificaciones';
import { useNotificacionesContacto, type NotificacionContacto } from '@/Modules/QuejasSugerenciasReportes/hook/HookNotificacionesContacto';
import { useUserPermissions } from '@/Modules/Auth/Hooks/PermissionHook';
import { IoPersonSharp } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type TabKey = 'solicitudes' | 'Quejas Sugerencias y Reportes';

interface BuzonNotificacionesProps {
  onVerSolicitud?: (notificacion: NotificacionSolicitud) => void;
  onVerContacto?: (notificacion: NotificacionContacto) => void;
}

export const BuzonNotificaciones: React.FC<BuzonNotificacionesProps> = ({ onVerSolicitud, onVerContacto }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('solicitudes');
  const { canView, isLoading: permisosLoading } = useUserPermissions();

  const puedeVerSolicitudes = !permisosLoading && canView('solicitudes');
  const puedeVerContacto = !permisosLoading && canView('quejasugerenciasreportes');

  const {
    notificaciones: notifSolicitudes,
    totalPendientes: totalSolicitudes,
    isLoading: loadingSolicitudes,
  } = useNotificacionesSolicitudes(puedeVerSolicitudes);

  const {
    notificaciones: notifContacto,
    totalPendientes: totalContacto,
    totalQuejas,
    totalSugerencias,
    totalReportes,
    isLoading: loadingContacto,
  } = useNotificacionesContacto(puedeVerContacto);

  const totalGlobal = totalSolicitudes + totalContacto;

  const tabsDisponibles = useMemo<TabKey[]>(() => {
    const tabs: TabKey[] = [];
    if (puedeVerSolicitudes) tabs.push('solicitudes');
    if (puedeVerContacto) tabs.push('Quejas Sugerencias y Reportes');
    return tabs;
  }, [puedeVerSolicitudes, puedeVerContacto]);

  // Si la pestaña activa no esta disponible, cambiar a la primera disponible
  useEffect(() => {
    if (tabsDisponibles.length > 0 && !tabsDisponibles.includes(activeTab)) {
      setActiveTab(tabsDisponibles[0]);
    }
  }, [tabsDisponibles, activeTab]);

  const getTipoIconSolicitud = (tipoSolicitud: string) => {
    switch (tipoSolicitud) {
      case 'Afiliacion': return <IoPersonSharp />;
      case 'Desconexion': return <LuUnplug />;
      case 'Cambio de Medidor': return <FaExchangeAlt />;
      case 'Asociado': return <FaHandshakeSimple />;
      default: return <LuNotebookText />;
    }
  };

  const getTipoColorSolicitud = (tipoSolicitud: string) => {
    switch (tipoSolicitud) {
      case 'Afiliacion': return 'text-emerald-600 bg-emerald-50';
      case 'Desconexion': return 'text-red-600 bg-red-50';
      case 'Cambio de Medidor': return 'text-blue-600 bg-blue-50';
      case 'Asociado': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTipoIconContacto = (tipo: NotificacionContacto['tipo']) => {
    switch (tipo) {
      case 'Queja': return <LuMessageSquare />;
      case 'Sugerencia': return <LuLightbulb />;
      case 'Reporte': return <LuFileText />;
    }
  };

  const getTipoColorContacto = (tipo: NotificacionContacto['tipo']) => {
    switch (tipo) {
      case 'Queja': return 'text-red-600 bg-red-50';
      case 'Sugerencia': return 'text-amber-600 bg-amber-50';
      case 'Reporte': return 'text-blue-600 bg-blue-50';
    }
  };

  const formatearFecha = (fecha: string | Date | null | undefined) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      return formatDistanceToNow(new Date(fecha), { addSuffix: true, locale: es });
    } catch {
      return 'Fecha invalida';
    }
  };

  const renderSolicitudes = () => {
    if (loadingSolicitudes) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full size-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando notificaciones...</p>
        </div>
      );
    }
    if (notifSolicitudes.length === 0) {
      return (
        <div className="p-6 sm:p-8 text-center">
          <LuBell className="size-10 sm:size-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay solicitudes pendientes</p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-gray-100">
        {notifSolicitudes.map((notificacion) => (
          <button
            key={notificacion.id}
            className="w-full text-left p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              onVerSolicitud?.(notificacion);
              setIsOpen(false);
            }}
            aria-label={`Ver solicitud de ${notificacion.nombre}`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                {notificacion.tipo === 'fisica' ? (
                  <LuUser className="size-5 text-blue-600" />
                ) : (
                  <LuBuilding className="size-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-base sm:text-lg flex-shrink-0">
                    {getTipoIconSolicitud(notificacion.tipoSolicitud)}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${getTipoColorSolicitud(notificacion.tipoSolicitud)}`}>
                    {notificacion.tipoSolicitud}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1 truncate">{notificacion.nombre}</p>
                <p className="text-xs text-gray-600 mb-2 truncate">
                  {notificacion.tipo === 'fisica' ? 'Cedula' : 'Cedula Juridica'}: {notificacion.cedula}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <LuClock className="size-3 flex-shrink-0" />
                  <span className="truncate">{formatearFecha(notificacion.fechaCreacion)}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <LuEye className="size-4 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderContacto = () => {
    if (loadingContacto) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full size-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Cargando notificaciones...</p>
        </div>
      );
    }
    if (notifContacto.length === 0) {
      return (
        <div className="p-6 sm:p-8 text-center">
          <LuBell className="size-10 sm:size-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay contactos pendientes</p>
        </div>
      );
    }
    return (
      <div className="divide-y divide-gray-100">
        {notifContacto.map((notificacion) => (
          <button
            key={notificacion.id}
            className="w-full text-left p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              if (onVerContacto) {
                onVerContacto(notificacion);
              } else {
                const ruta = notificacion.tipo === 'Queja' ? '/Quejas'
                  : notificacion.tipo === 'Sugerencia' ? '/Sugerencias'
                  : '/Reportes';
                window.location.href = ruta;
              }
              setIsOpen(false);
            }}
            aria-label={`Ver ${notificacion.tipo.toLowerCase()} de ${notificacion.nombre}`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <span className={`inline-flex size-8 items-center justify-center rounded-lg ${getTipoColorContacto(notificacion.tipo)}`}>
                  {getTipoIconContacto(notificacion.tipo)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${getTipoColorContacto(notificacion.tipo)}`}>
                    {notificacion.tipo}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1 truncate">{notificacion.nombre}</p>
                {notificacion.detalle && (
                  <p className="text-xs text-gray-600 mb-1 truncate">{notificacion.detalle}</p>
                )}
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{notificacion.mensaje}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <LuClock className="size-3 flex-shrink-0" />
                  <span className="truncate">{formatearFecha(notificacion.fechaCreacion)}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <LuEye className="size-4 text-gray-400" />
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // Si no hay permisos para nada no renderiza
  if (tabsDisponibles.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title={`${totalGlobal} notificaciones pendientes`}
      >
        <LuBell className="size-5 sm:size-6" />
        {totalGlobal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full size-4 sm:size-5 flex items-center justify-center font-medium animate-pulse">
            {totalGlobal > 99 ? '99+' : totalGlobal}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar panel de notificaciones"
          />

          {/* Panel - responsive */}
          <div
            className="
              fixed inset-x-2 top-16 z-50
              sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2
              sm:w-96 md:w-[420px]
              bg-white rounded-lg shadow-xl border border-gray-200
              max-h-[80vh] sm:max-h-[28rem]
              flex flex-col overflow-hidden
            "
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <LuBell className="size-4 sm:size-5 text-blue-600 flex-shrink-0" />
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">Notificaciones</h3>
                {totalGlobal > 0 && (
                  <span className="bg-red-100 text-red-700 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                    {totalGlobal}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Cerrar"
              >
                <LuX className="size-4" />
              </button>
            </div>

            {/* Tabs */}
            {tabsDisponibles.length > 1 && (
              <div className="flex border-b border-gray-200 bg-white" role="tablist">
                {tabsDisponibles.includes('solicitudes') && (
                  <button
                    role="tab"
                    aria-selected={activeTab === 'solicitudes'}
                    onClick={() => setActiveTab('solicitudes')}
                    className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'solicitudes'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Solicitudes</span>
                    {totalSolicitudes > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        {totalSolicitudes > 99 ? '99+' : totalSolicitudes}
                      </span>
                    )}
                  </button>
                )}
                {tabsDisponibles.includes('Quejas Sugerencias y Reportes') && (
                  <button
                    role="tab"
                    aria-selected={activeTab === 'Quejas Sugerencias y Reportes'}
                    onClick={() => setActiveTab('Quejas Sugerencias y Reportes')}
                    className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'Quejas Sugerencias y Reportes'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>Quejas Sugerencias y Reportes</span>
                    {totalContacto > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        {totalContacto > 99 ? '99+' : totalContacto}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Lista */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100">
              {activeTab === 'solicitudes' && renderSolicitudes()}
              {activeTab === 'Quejas Sugerencias y Reportes' && renderContacto()}
            </div>

            {/* Footer */}
            {((activeTab === 'solicitudes' && totalSolicitudes > 0) ||
              (activeTab === 'Quejas Sugerencias y Reportes' && totalContacto > 0)) && (
              <div className="p-2 sm:p-3 border-t border-gray-200 bg-gray-50">
                {activeTab === 'solicitudes' ? (
                  <button
                    onClick={() => {
                      window.location.href = '/Solicitudes';
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todas las solicitudes
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 text-xs">
                    {totalQuejas > 0 && (
                      <button
                        onClick={() => { window.location.href = '/Contacto'; setIsOpen(false); }}
                        className="flex-1 text-center text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Ver todas las quejas sugerencias y reportes
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
