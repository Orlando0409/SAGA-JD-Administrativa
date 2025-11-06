import apiAuth from "@/Api/apiAuth";
import type { AsignarMedidorDTO, AsignarMedidorResponse } from "../../Models/ModeloMedidorAfiliacion";

export class ServiceAsignarMedidor {
  static async asignarMedidor(
    dto: AsignarMedidorDTO
  ): Promise<AsignarMedidorResponse> {
    try {
      console.log(" Asignando medidor a afiliado:", dto);

      const response = await apiAuth.post<AsignarMedidorResponse>(
        "/Inventario/asignar/medidor",
        dto
      );

      console.log(" Medidor asignado correctamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al asignar medidor:", error);
      throw error;
    }
  }
}