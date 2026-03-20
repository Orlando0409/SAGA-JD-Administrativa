

export interface Asignar {
    Id_Medidor: number;
    Id_Tipo_Entidad: number;
    Id_Solicitud: number;
    tipoSolicitud?: 'Afiliacion' | 'Cambio de Medidor' | 'Asociado' | 'Desconexion' | 'Agregar Medidor';
}

export interface AsignarMedidorResponse {
    success: boolean;
    message: string;
    data: {
        Id_Tipo_Entidad: number;
        Id_Solicitud: number;
        Id_Medidor: number;

    };
}

export type AsignarMedidorDTO = Asignar;