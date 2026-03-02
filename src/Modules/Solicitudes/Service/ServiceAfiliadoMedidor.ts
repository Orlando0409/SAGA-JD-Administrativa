import apiAuth from "@/Api/apiAuth";
import type { AsignarMedidorDTO, AsignarMedidorResponse } from "../Models/ModeloMedidorAfiliacion";

export class ServiceAsignarMedidor {
    static async asignarMedidor(
        dto: AsignarMedidorDTO
    ): Promise<AsignarMedidorResponse> {
        try {
            console.log(" Asignando medidor:", dto);

            let response;

            if (dto.tipoSolicitud === 'Cambio de Medidor') {
              
                const baseUrl = dto.Id_Tipo_Entidad === 1
                    ? `/solicitudes-fisicas/update/cambio-medidor/${dto.Id_Solicitud}`
                    : `/solicitudes-juridicas/update/cambio-medidor/${dto.Id_Solicitud}`;

                response = await apiAuth.put<AsignarMedidorResponse>(
                    baseUrl,
                    { Id_Medidor: dto.Id_Medidor }
                );
            } else {
                
                response = await apiAuth.post<AsignarMedidorResponse>(
                    '/Inventario/asignar/medidor',
                    {
                        Id_Medidor: dto.Id_Medidor,
                        Id_Tipo_Entidad: dto.Id_Tipo_Entidad,
                        Id_Solicitud: dto.Id_Solicitud
                    }
                );
            }

            console.log(" Medidor asignado correctamente:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Error al asignar medidor:", error);
            throw error;
        }
    }
}