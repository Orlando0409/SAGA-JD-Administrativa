export interface EstadoReporte {
    IdEstadoReporte: number;
    Estado_Reporte: string;
}

export interface Reporte {
    IdReporte: number;
    Nombre: string;
    Primer_Apellido: string;
    Segundo_Apellido?: string;
    Ubicacion: string;
    Descripcion: string;
    Fecha_Reporte: Date | string;
    Correo: string;
    Adjunto?: string;
    RespuestasReporte?: string | null;
    Estado: EstadoReporte;
}

// Interfaz para crear un reporte
export interface CreateReporteData {
    Nombre: string;
    Primer_Apellido: string;
    Segundo_Apellido: string;
    Ubicacion: string;
    Correo: string;
    Descripcion: string;
}