export interface EstadoQueja {
    Id_Estado_Queja: number;
    Estado_Queja: string;
}

export interface Queja {
    Id_Queja: number;
    Nombre: string;
    Primer_Apellido: string;
    Segundo_Apellido: string;
    Correo: string;
    Descripcion: string;
    Adjunto?: string;
    RespuestasReporte?: string | null;
    Estado: EstadoQueja;
    Fecha_Queja: Date | string;
}

// Interfaz para crear una queja
export interface CreateQuejaData {
    Nombre: string;
    Primer_Apellido: string;
    Segundo_Apellido?: string;
    Correo: string;
    Descripcion: string;
}