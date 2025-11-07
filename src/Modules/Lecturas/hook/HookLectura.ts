import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlerts } from "@/Modules/Global/context/AlertContext";
import { 
    getAllLecturas, 
    getTarifasLecturas, 
    getLecturasByUsuario,
    getLecturasByMedidor,
    getLecturasByAfiliado,
    getLecturasEntreFechas,
    importarCSVLecturas,
    createLectura, 
    updateLectura 
} from "../service/LecturaService";
import type { Lectura, CreateLecturaDTO, UpdateLecturaDTO, TipoTarifaLectura } from "../model/Lectura";

// Obtener todas las lecturas
export const useGetLecturas = () => {
    return useQuery<Lectura[]>({
        queryKey: ["lecturas"],
        queryFn: getAllLecturas,
    });
};

// Obtener tarifas de lecturas
export const useGetTarifas = () => {
    return useQuery<TipoTarifaLectura[]>({
        queryKey: ["tarifasLecturas"],
        queryFn: getTarifasLecturas,
    });
};

// Obtener lecturas por usuario
export const useGetLecturasByUsuario = (idUsuario: number) => {
    return useQuery<Lectura[]>({
        queryKey: ["lecturas", "usuario", idUsuario],
        queryFn: () => getLecturasByUsuario(idUsuario),
        enabled: !!idUsuario,
    });
};

// Obtener lecturas por medidor
export const useGetLecturasByMedidor = (idMedidor: number) => {
    return useQuery<Lectura[]>({
        queryKey: ["lecturas", "medidor", idMedidor],
        queryFn: () => getLecturasByMedidor(idMedidor),
        enabled: !!idMedidor,
    });
};

// Obtener lecturas por afiliado
export const useGetLecturasByAfiliado = (idAfiliado: number) => {
    return useQuery<Lectura[]>({
        queryKey: ["lecturas", "afiliado", idAfiliado],
        queryFn: () => getLecturasByAfiliado(idAfiliado),
        enabled: !!idAfiliado,
    });
};

// Obtener lecturas entre fechas
export const useGetLecturasEntreFechas = (fechaInicio: string, fechaFin: string, enabled = false) => {
    return useQuery<Lectura[]>({
        queryKey: ["lecturas", "fechas", fechaInicio, fechaFin],
        queryFn: () => getLecturasEntreFechas(fechaInicio, fechaFin),
        enabled: enabled && !!fechaInicio && !!fechaFin,
    });
};

// Importar CSV de lecturas
export const useImportarCSVLecturas = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlerts();

    return useMutation({
        mutationFn: (file: File) => importarCSVLecturas(file),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["lecturas"] });
            
            // Extraer información de la respuesta
            const { Resultados } = data;
            const { 
                "Filas Totales": filasTotales, 
                "Lecturas Creadas": lecturasCreadas, 
                "Errores": errores,
                "Detalles de Errores": detallesErrores 
            } = Resultados;

            // Si hay errores, mostrar alerta con los detalles
            if (errores > 0) {
                const erroresDetalle = detallesErrores.slice(0, 5).join(", ");
                const mensajeErrores = errores > 5 
                    ? `${erroresDetalle}... y ${errores - 5} más`
                    : erroresDetalle;
                
                showAlert(
                    lecturasCreadas > 0 ? "warning" : "error",
                    lecturasCreadas > 0 
                        ? `Importación parcial: ${lecturasCreadas}/${filasTotales} lecturas creadas`
                        : "Error en la importación",
                    `${errores} errores encontrados: ${mensajeErrores}`
                );
            } else {
                showAlert(
                    "success",
                    "Lecturas importadas exitosamente",
                    `${lecturasCreadas} de ${filasTotales} lecturas procesadas correctamente`
                );
            }
        },
        onError: (error: any) => {
            showAlert(
                "error",
                "Error al importar lecturas",
                error.response?.data?.message || "No se pudo procesar el archivo CSV"
            );
        },
    });
};

// Crear una lectura
export const useCreateLectura = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlerts();

    return useMutation({
        mutationFn: (lectura: CreateLecturaDTO) => createLectura(lectura),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lecturas"] });
            showAlert(
                "success",
                "Lectura creada exitosamente",
                "La lectura se registró correctamente"
            );
        },
        onError: (error: any) => {
            showAlert(
                "error",
                "Error al crear lectura",
                error.response?.data?.message || "No se pudo registrar la lectura"
            );
        },
    });
};

// Actualizar una lectura
export const useUpdateLectura = () => {
    const queryClient = useQueryClient();
    const { showAlert } = useAlerts();

    return useMutation({
        mutationFn: ({ idLectura, lectura }: { idLectura: number; lectura: UpdateLecturaDTO }) => 
            updateLectura(idLectura, lectura),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lecturas"] });
            showAlert(
                "success",
                "Lectura actualizada exitosamente",
                "Los cambios se guardaron correctamente"
            );
        },
        onError: (error: any) => {
            showAlert(
                "error",
                "Error al actualizar lectura",
                error.response?.data?.message || "No se pudo actualizar la lectura"
            );
        },
    });
};
