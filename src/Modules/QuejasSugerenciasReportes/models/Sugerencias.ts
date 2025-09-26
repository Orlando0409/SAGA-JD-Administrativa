export interface Sugerencia {
    id: number;
    mensaje: string;
    fechaCreacion: Date | string | null 
    adjunto?: File  | null;
}