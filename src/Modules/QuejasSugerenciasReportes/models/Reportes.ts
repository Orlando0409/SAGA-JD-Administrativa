export interface EstadoReporte {
    IdEstadoReporte: number;
    Estado_Reporte: string;
}

export interface Reporte {
    IdReporte: number;
    name: string;
    Papellido?: string;
    Sapellido?: string;
    ubicacion?: string;
    descripcion?: string;
    Fecha_Reporte: Date | string;
    Adjunto?: string[];
    RespuestasReporte?: string | null;
    Estado: EstadoReporte;
}

// Interfaz para crear un reporte
export interface CreateReporteData {
    name: string;
    Papellido: string;
    Sapellido: string;
    ubicacion: string;
    descripcion: string;
}