export interface Lectura {
    Id_Lectura: number;
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
        Nombre_Afiliado: string;
        Tipo_Afiliado: {
            Id_Tipo_Afiliado: number;
            Nombre_Tipo: string;
        };
        Estado: {
            Id_Estado_Afiliado: number;
            Nombre_Estado: string;
        };
    } | null;
    Tipo_Tarifa: {
        Id_Tipo_Tarifa_Lectura: number;
        Nombre_Tipo_Tarifa: string;
        Cargo_Fijo_Por_Mes: number;
    };
    Valor_Lectura_Anterior: number;
    Valor_Lectura_Actual: number;
    Consumo_Calculado_M3: number;
    Total_A_Pagar?: number;
    Fecha_Lectura: string;
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

export const LecturaInicial: Lectura = {
    Id_Lectura: 0,
    Medidor: {
        Id_Medidor: 0,
        Numero_Medidor: 0,
        Estado: {
            Id_Estado: 0,
            Nombre_Estado: '',
        },
    },
    Afiliado: null,
    Tipo_Tarifa: {
        Id_Tipo_Tarifa_Lectura: 0,
        Nombre_Tipo_Tarifa: '',
        Cargo_Fijo_Por_Mes: 0,
    },
    Valor_Lectura_Anterior: 0,
    Valor_Lectura_Actual: 0,
    Consumo_Calculado_M3: 0,
    Total_A_Pagar: 0,
    Fecha_Lectura: '',
    Usuario: {
        Id_Usuario: 0,
        Nombre_Usuario: '',
        Id_Rol: 0,
        Nombre_Rol: '',
    },
};
