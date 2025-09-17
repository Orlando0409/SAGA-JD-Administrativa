export interface AfiliacionFisica {
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
  // 🆕 Agregar campo para el tipo
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: number; // 1 = Abonado, 2 = Asociado
    Nombre_Tipo_Afiliado: string; // "Abonado" o "Asociado"
  };
}

export const AfiliacionFisicaInicialState: AfiliacionFisica = {
  Nombre: '',
  Apellido1: '',
  Apellido2: '',
  Cedula: '',
  Correo: '',
  Direccion_Exacta: '',
  Numero_Telefono: '',
  Edad: 0,
  Planos_Terreno: undefined,
  Escritura_Terreno: undefined,
  // 🆕 Valor por defecto
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: 1, // Por defecto Abonado
    Nombre_Tipo_Afiliado: 'Abonado'
  }
};

export interface AfiliacionFisicaFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
  // 🆕 Agregar campo para el tipo en FormData
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: number;
    Nombre_Tipo_Afiliado: string;
  };
}
