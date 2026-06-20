import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiAuth from '@/Api/apiAuth';

type SolicitudOrigen = 'fisica' | 'juridica';
type SolicitudAccion = 'created' | 'updated' | 'estado-changed';
type ContactoTipo = 'queja' | 'sugerencia' | 'reporte';
type ContactoAccion = 'created' | 'estado-changed';

export interface SolicitudStreamEvent {
    type: 'solicitud' | 'contacto' | 'ping';
    accion?: SolicitudAccion | ContactoAccion;
    origen?: SolicitudOrigen;
    tipoSolicitud?: string;
    idSolicitud?: number;
    nuevoEstado?: string;
    contactoTipo?: ContactoTipo;
    idRegistro?: number;
    timestamp: number;
}

interface HookSolicitudesStreamOptions {
    enabled?: boolean;
    onEvent?: (event: SolicitudStreamEvent) => void;
}

const SSE_PATH = '/notificaciones/solicitudes/stream';
const RECONNECT_BASE_MS = 2_000;
const RECONNECT_MAX_MS = 30_000;

/**
 * Stream SSE de eventos de solicitudes.
 * Auth via cookies (withCredentials). Auto-reconecta con backoff exponencial
 * y limpia conexion al desmontar/disabled.
 */
export function useSolicitudesStream({ enabled = true, onEvent }: HookSolicitudesStreamOptions = {}) {
    const queryClient = useQueryClient();
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onEventRef = useRef(onEvent);

    useEffect(() => {
        onEventRef.current = onEvent;
    }, [onEvent]);

    useEffect(() => {
        if (!enabled) return;

        const apiURL = import.meta.env.VITE_API_URL ?? '';
        const url = `${apiURL}${SSE_PATH}`;

        let isCancelled = false;

        const handleEvent = (rawData: string) => {
            try {
                const parsed = JSON.parse(rawData) as SolicitudStreamEvent;
                if (parsed.type === 'ping') return;

                if (parsed.type === 'solicitud') {
                    queryClient.invalidateQueries({ queryKey: ['solicitudes-fisicas'] });
                    queryClient.invalidateQueries({ queryKey: ['solicitudes-juridicas'] });
                    onEventRef.current?.(parsed);
                } else if (parsed.type === 'contacto') {
                    if (parsed.contactoTipo === 'queja') queryClient.invalidateQueries({ queryKey: ['quejas'] });
                    else if (parsed.contactoTipo === 'sugerencia') queryClient.invalidateQueries({ queryKey: ['sugerencias'] });
                    else if (parsed.contactoTipo === 'reporte') queryClient.invalidateQueries({ queryKey: ['reportes'] });
                    onEventRef.current?.(parsed);
                }
            } catch (err) {
                console.error('SSE parse error:', err);
            }
        };

        const connect = () => {
            if (isCancelled) return;

            try {
                const source = new EventSource(url, { withCredentials: true });
                eventSourceRef.current = source;

                source.onopen = () => {
                    reconnectAttemptsRef.current = 0;
                };

                source.onmessage = (event) => handleEvent(event.data);

                source.onerror = async () => {
                    source.close();
                    eventSourceRef.current = null;

                    if (isCancelled) return;

                    // Tras un fallo intentamos refrescar el token (cookies http-only).
                    // Si tambien falla, dejamos que el backoff reintente la conexion.
                    try {
                        await apiAuth.post('/auth/refresh');
                    } catch {
                        /* silencioso */
                    }

                    const attempt = reconnectAttemptsRef.current + 1;
                    reconnectAttemptsRef.current = attempt;
                    const delay = Math.min(RECONNECT_BASE_MS * 2 ** (attempt - 1), RECONNECT_MAX_MS);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (!isCancelled) connect();
                    }, delay);
                };
            } catch (err) {
                console.error('SSE connect error:', err);
            }
        };

        connect();

        return () => {
            isCancelled = true;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [enabled, queryClient]);
}
