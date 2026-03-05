import { AlertDialog, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/Modules/Global/components/Sidebar/ui/alert-dialog";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ContactoItem } from "../types/ContactoTypes";

interface ArchiveMutations {
  actualizarEstadoQuejaMutation: { isPending: boolean; mutateAsync: (args: any) => Promise<any> };
  actualizarEstadoSugerenciaMutation: { isPending: boolean; mutateAsync: (args: any) => Promise<any> };
  actualizarEstadoReporteMutation: { isPending: boolean; mutateAsync: (args: any) => Promise<any> };
  handleArchive: (item: ContactoItem) => Promise<void>;
  hasViewPermission: boolean;
  hasEditPermission: boolean;
}


export const renderTipoCell = (item: ContactoItem) => {
  let colorClass = '';
  switch (item.tipo) {
    case 'Queja':
      colorClass = 'text-red-700';
      break;
    case 'Sugerencia':
      colorClass = 'text-yellow-700';
      break;
    case 'Reporte':
      colorClass = 'text-blue-700';
      break;
  }

  return (
    <span className={`text-sm font-medium ${colorClass}`}>
      {item.tipo}
    </span>
  );
};

export const renderPersonaCell = (item: ContactoItem) => {
  const nombreCompleto = [item.nombre, item.primerApellido, item.segundoApellido]
    .filter(Boolean)
    .join(' ');

  return (
    <span className="text-sm">
      {nombreCompleto || <span className="text-gray-400 italic">Anónimo</span>}
    </span>
  );
};

export const renderMensajeCell = (mensaje?: string) => {
  if (!mensaje) return <span className="text-gray-400 text-sm">-</span>;
  const truncated = mensaje.length > 50 ? mensaje.substring(0, 50) + '...' : mensaje;
  return (
    <span className="text-sm text-gray-700" title={mensaje}>
      {truncated}
    </span>
  );
};

export const renderEstadoCell = (item: ContactoItem) => {
  if (!item.estado) return <span className="text-gray-400 text-sm">-</span>;

  let badgeClass = '';
  switch (item.estado) {
    case 'Pendiente':
      badgeClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Contestado':
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case 'Archivado':
      badgeClass = 'bg-red-100 text-red-800 border border-red-300'; 
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${badgeClass}`}>
      {item.estado}
    </span>
  );
};

export const renderFechaCell = (fecha?: Date | string | null) => {
  if (!fecha) return 'N/A';
  const fechaObj = new Date(fecha);
  return (
    <span className="text-sm">
      {format(fechaObj, 'dd/MM/yyyy', { locale: es })}
    </span>
  );
};



export const renderAccionesCell = (item: ContactoItem, mutations: ArchiveMutations) => {
  const { 
    actualizarEstadoQuejaMutation, 
    actualizarEstadoSugerenciaMutation, 
    actualizarEstadoReporteMutation, 
    handleArchive,
    hasViewPermission,
    hasEditPermission
  } = mutations;
  
  // Determinar si alguna mutación está pendiente
  const isPendingMutation = 
    (item.tipo === 'Queja' && actualizarEstadoQuejaMutation.isPending) ||
    (item.tipo === 'Sugerencia' && actualizarEstadoSugerenciaMutation.isPending) ||
    (item.tipo === 'Reporte' && actualizarEstadoReporteMutation.isPending);

  const isArchived = item.estado === 'Archivado';
  
  const actionText = isArchived ? 'Desarchivar' : 'Archivar';
  const actionColor = isArchived ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  const actionTitle = isArchived ? `Desarchivar ${item.tipo}` : `Archivar ${item.tipo}`;

  return (
    <div className="flex items-center gap-2">
      {hasViewPermission && (
        <button
          className="px-4 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
          title="Ver detalles"
          onClick={() => window.dispatchEvent(new CustomEvent('openContactoDetail', { detail: item }))}
        >
          Ver
        </button>
      )}
      {/* El botón Responder solo se muestra si NO está archivado */}
      {hasEditPermission && !isArchived && item.estado === 'Pendiente' && ( 
        <button
          className="px-4 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          title="Responder"
          onClick={() => window.dispatchEvent(new CustomEvent('openContactoResponder', { detail: item }))}
        >
          Responder
        </button>
      )}
      {hasEditPermission && (item.estado === 'Contestado' || item.estado === 'Archivado') && (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            disabled={isPendingMutation} 
            className={`px-4 py-1 text-white text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actionColor}`}
            title={actionTitle}
          >
            {isPendingMutation ? (isArchived ? 'Desarchivando...' : 'Archivando...') : actionText}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar {actionText}?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas {actionText.toLowerCase()} est@ {item.tipo}? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              // handleArchive ahora recibe el item y determina la acción dentro de ContactoTable
              onClick={() => handleArchive(item)} 
              disabled={isPendingMutation}
            >
              {isPendingMutation ? (isArchived ? 'Desarchivando...' : 'Archivando...') : `${actionText}`}
            </AlertDialogAction>
            <AlertDialogCancel disabled={isPendingMutation}>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        )}
    </div>

  );
};