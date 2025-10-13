export interface EstadoQueja {
    Id_Estado_Queja: number;
    Estado_Queja: string;
}

export interface Queja {
    Id_Queja: number;
    name: string;
    Papellido: string;
    Sapellido: string;
    descripcion: string;
    Adjunto?: string[];
    RespuestasReporte?: string | null;
    Estado: EstadoQueja;
    Fecha_Queja: Date | string;
}

// Interfaz para crear una queja
export interface CreateQuejaData {
    name: string;
    Papellido?: string;
    Sapellido?: string;
    descripcion: string;
}