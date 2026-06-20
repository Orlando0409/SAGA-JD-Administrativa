import { useMemo } from 'react';
import { useQuejas, useSugerencias, useReportes } from './HookContacto';

export type ContactoNotificacionTipo = 'Queja' | 'Sugerencia' | 'Reporte';

export interface NotificacionContacto {
    id: string;
    tipo: ContactoNotificacionTipo;
    nombre: string;
    detalle: string;
    fechaCreacion: string | Date;
    mensaje: string;
    rawId: number;
    raw: any;
}

const formatNombre = (item: any): string => {
    const nombre = item?.Nombre?.toString().trim();
    const apellido1 = item?.Primer_Apellido?.toString().trim();
    const apellido2 = item?.Segundo_Apellido?.toString().trim();
    const completo = [nombre, apellido1, apellido2].filter(Boolean).join(' ').trim();
    return completo || item?.Correo || 'Anonimo';
};

const formatFecha = (item: any): string | Date => {
    return item?.Fecha_Reporte || item?.Fecha_Creacion || item?.createdAt || item?.created_at || new Date();
};

export const useNotificacionesContacto = (enabled: boolean = true) => {
    const { data: quejas = [], isLoading: loadingQuejas } = useQuejas('Pendiente', enabled);
    const { data: sugerencias = [], isLoading: loadingSugerencias } = useSugerencias('Pendiente', enabled);
    const { data: reportes = [], isLoading: loadingReportes } = useReportes('Pendiente', enabled);

    const notificaciones = useMemo<NotificacionContacto[]>(() => {
        const lista: NotificacionContacto[] = [];

        for (const q of quejas) {
            lista.push({
                id: `queja-${q.Id_Queja}`,
                tipo: 'Queja',
                nombre: formatNombre(q),
                detalle: q.Correo || '',
                fechaCreacion: formatFecha(q),
                mensaje: q.Descripcion || 'Sin descripcion',
                rawId: q.Id_Queja,
                raw: q,
            });
        }

        for (const s of sugerencias) {
            lista.push({
                id: `sugerencia-${s.Id_Sugerencia}`,
                tipo: 'Sugerencia',
                nombre: formatNombre(s),
                detalle: s.Correo || '',
                fechaCreacion: formatFecha(s),
                mensaje: s.Mensaje || s.Descripcion || 'Sin mensaje',
                rawId: s.Id_Sugerencia,
                raw: s,
            });
        }

        for (const r of reportes) {
            lista.push({
                id: `reporte-${r.Id_Reporte}`,
                tipo: 'Reporte',
                nombre: formatNombre(r),
                detalle: r.Ubicacion || r.Correo || '',
                fechaCreacion: formatFecha(r),
                mensaje: r.Descripcion || 'Sin descripcion',
                rawId: r.Id_Reporte,
                raw: r,
            });
        }

        return lista.sort((a, b) => {
            const ta = new Date(a.fechaCreacion).getTime();
            const tb = new Date(b.fechaCreacion).getTime();
            return tb - ta;
        });
    }, [quejas, sugerencias, reportes]);

    return {
        notificaciones,
        totalPendientes: notificaciones.length,
        totalQuejas: quejas.length,
        totalSugerencias: sugerencias.length,
        totalReportes: reportes.length,
        isLoading: loadingQuejas || loadingSugerencias || loadingReportes,
    };
};
