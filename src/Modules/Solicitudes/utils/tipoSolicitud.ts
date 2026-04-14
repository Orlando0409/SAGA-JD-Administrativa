export const toTipoSolicitudSlug = (tipo: string) =>
{
    const slugMap: Record<string, string> = {
        Afiliacion: 'afiliacion',
        Desconexion: 'desconexion',
        'Cambio de Medidor': 'cambio-medidor',
        Asociado: 'asociado',
        'Agregar Medidor': 'agregar-medidor',
    };

    return slugMap[tipo] || 'afiliacion';
};
