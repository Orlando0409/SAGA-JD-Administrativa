export interface Reporte {
    id: number;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    ubicacion: string;
    mensaje: string;
    fechaCreacion: Date | string | null 
    estado: 'Pendiente' | 'En Proceso' | 'Resuelto';
    adjunto?: File | null;
}