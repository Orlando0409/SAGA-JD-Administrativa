export interface EstadoReporte {
    Id_Estado_Reporte: number;
    Estado_Reporte: string;
}

export interface Reporte {
    Id_Reporte: number;
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
