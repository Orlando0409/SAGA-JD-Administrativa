// Utilidades para mostrar los datos de auditoría de forma legible:
// oculta identificadores internos y formatea valores (fechas, booleanos, objetos).

const ID_REGEX = /(^id$)|(^id_)|(_id$)/i;

export function esCampoId(key: string): boolean {
  return ID_REGEX.test(key);
}

/** "Nombre_Usuario" -> "Nombre Usuario" */
export function prettyLabel(key: string): string {
  const limpia = key.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  return limpia.charAt(0).toUpperCase() + limpia.slice(1);
}

function pareceFechaISO(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2})/.test(value);
}

/** Formatea un valor a texto legible. Las fechas se muestran en la hora local del navegador. */
export function formatValor(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (pareceFechaISO(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' });
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    const partes = value.map(formatValor).filter((s) => s !== '—');
    return partes.length ? partes.join(', ') : '—';
  }
  if (typeof value === 'object') {
    const partes = Object.entries(value as Record<string, unknown>)
      .filter(([k]) => !esCampoId(k))
      .map(([k, v]) => `${prettyLabel(k)}: ${formatValor(v)}`);
    return partes.length ? partes.join(' · ') : '—';
  }
  return String(value);
}

export interface CampoAuditoria {
  label: string;
  valor: string;
}

/**
 * Convierte el objeto de datos (anteriores/nuevos) en una lista de campos
 * label/valor, ocultando IDs. Devuelve null si no hay nada que mostrar.
 */
export function construirCampos(data: unknown): CampoAuditoria[] | null {
  if (data === null || data === undefined) return null;

  if (typeof data !== 'object' || Array.isArray(data)) {
    return [{ label: 'Valor', valor: formatValor(data) }];
  }

  const entries = Object.entries(data as Record<string, unknown>).filter(
    ([k]) => !esCampoId(k),
  );
  if (entries.length === 0) return null;

  return entries.map(([key, value]) => ({
    label: prettyLabel(key),
    valor: formatValor(value),
  }));
}
