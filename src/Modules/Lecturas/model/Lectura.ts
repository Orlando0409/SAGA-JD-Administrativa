export interface Lectura {
    Id_Lectura: number;
    Tipo_Tarifa: {
        Id_Tipo_Tarifa_Lectura: number;
        Nombre_Tipo_Tarifa: string;
        Cargo_Fijo_Por_Mes: number;
    };
    Valor_Lectura_Anterior: number;
    Valor_Lectura_Actual: number;
    Consumo_Calculado_M3: number;
    Fecha_Lectura: string;
    Medidor: {
        Id_Medidor: number;
        Numero_Medidor: number;
        Estado: {
            Id_Estado: number;
            Nombre_Estado: string;
        };
    };
    Afiliado: {
        Id_Afiliado: number;
        Tipo_Entidad: number;
        Correo: string;
        Numero: string;
        Tipo_Identificacion: number;
        Identificacion: string;
        Nombre: string;
        Primer_Apellido: string;
        Segundo_Apellido: string; 
    } | null;
  
    Usuario: {
        Id_Usuario: number;
        Nombre_Usuario: string;
        Id_Rol: number;
        Nombre_Rol: string;
    };
}

export interface TipoTarifaLectura {
    Id_Tipo_Tarifa_Lectura: number;
    Nombre_Tipo_Tarifa: string;
    Cargo_Fijo_Por_Mes: number;
}

export interface CreateLecturaDTO {
    Numero_Medidor: number;
    Id_Tipo_Tarifa: number;
    Valor_Lectura: number;
}

export interface UpdateLecturaDTO {
    Id_Tipo_Tarifa: number;
    Valor_Lectura: number;
    Numero_Medidor: number;
}

