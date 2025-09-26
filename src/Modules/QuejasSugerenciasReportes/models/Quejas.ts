export interface Queja {
    id: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    mensaje: string;
    fechaCreacion: Date | string | null 
    adjunto?: File | null;
}