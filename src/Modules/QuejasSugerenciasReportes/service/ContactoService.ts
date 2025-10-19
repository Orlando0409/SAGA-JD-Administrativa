import axiosPrivate from "@/Api/apiAuth";

export const responderQueja = async (idQueja: number, respuesta: string) => {
    const response = await axiosPrivate.post(`/quejas/${idQueja}/responder`, { respuesta });
    return response.data;
}

export const responderSugerencia = async (idSugerencia: number, respuesta: string) => {
    const response = await axiosPrivate.post(`/sugerencias/${idSugerencia}/responder`, { respuesta });
    return response.data;
}

export const responderReporte = async (idReporte: number, respuesta: string) => {
    const response = await axiosPrivate.post(`/reportes/${idReporte}/responder`, { respuesta });
    return response.data;
}
export const obtenerQuejas = async () => {
    const response = await axiosPrivate.get('/quejas');
    return response.data;
}

export const obtenerSugerencias = async () => {
    const response = await axiosPrivate.get('/sugerencias');
    return response.data;
}

export const obtenerReportes = async () => {
    const response = await axiosPrivate.get('/reportes');
    return response.data;
}
export const actualizarEstadoReporte = async (idReporte: number, idEstado: number) => {
    const response = await axiosPrivate.put(`/reportes/${idReporte}/estado`, { idEstado });
    return response.data;
}
