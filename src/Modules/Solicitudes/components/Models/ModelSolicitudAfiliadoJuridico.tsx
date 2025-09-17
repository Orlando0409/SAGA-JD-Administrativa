export interface AfiliacionJuridica {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
  // 🆕 Agregar campo para el tipo
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: number; // 1 = Abonado, 2 = Asociado
    Nombre_Tipo_Afiliado: string; // "Abonado" o "Asociado"
  };
}

export const AfiliacionJuridicaInicialState: AfiliacionJuridica = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Direccion_Exacta: '',
  Numero_Telefono: '',
  Planos_Terreno: undefined,
  Escritura_Terreno: undefined,
  // 🆕 Valor por defecto
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: 1, // Por defecto Abonado
    Nombre_Tipo_Afiliado: 'Abonado'
  }
};

export interface AfiliacionJuridicaFormData {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
  // 🆕 Agregar campo para el tipo en FormData
  Tipo_Afiliado: {
    Id_Tipo_Afiliado: number;
    Nombre_Tipo_Afiliado: string;
  };
}