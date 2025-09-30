import type { Material } from "./Material";

export interface EstadoMaterial {
  Id_Estado_Material: number;
  Nombre_Estado_Material: string;
  Materiales?: Material[];
}