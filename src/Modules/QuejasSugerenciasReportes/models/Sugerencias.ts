export interface EstadoSugerencia {
    Id_EstadoSugerencia: number;
    Estado_Sugerencia: string;
}

export interface Sugerencia {
    Id_Sugerencia: number;
    Fecha_Sugerencia: Date | string;
    Mensaje: string;
    Correo: string;
    Adjunto?: string[] | null;
    RespuestasSugerencia?: string | null;
    Estado: EstadoSugerencia;
}

export interface CreateSugerenciaData {
    Mensaje: string;
    Correo: string;
}