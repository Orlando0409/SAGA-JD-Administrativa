// Modelo principal del manual
export interface Manual {
  Id_Manual: number;
  Nombre_Manual: string;
  PDF_Manual: string; // URL del archivo PDF
  Usuario: {
    Id_Usuario: number;
    Nombre_Usuario: string;
    Correo: string;
  };
}

// Estado inicial (vacío)
export const ManualInicialState: Manual = {
  Id_Manual: 0,
  Nombre_Manual: "",
  PDF_Manual: "",
  Usuario: {
    Id_Usuario: 0,
    Nombre_Usuario: "",
    Correo: "",
  },
};
