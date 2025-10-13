export interface EstadoSugerencia {
    Id_EstadoSugerencia: number;
    Estado_Sugerencia: string;
}

export interface Sugerencia {
    Id_Sugerencia: number;
    Fecha_Sugerencia: Date | string;
    Mensaje: string;
    Adjunto?: string[] | null;
    RespuestasSugerencia?: string | null;
    Estado: EstadoSugerencia;
}

// Interfaz para crear una sugerencia
export interface CreateSugerenciaData {
    Mensaje: string;
}