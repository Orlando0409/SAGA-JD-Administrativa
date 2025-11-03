import axiosPrivate from '@/Api/apiAuth';
import type { Lectura, CreateLecturaDTO, UpdateLecturaDTO, TipoTarifaLectura } from '../model/Lectura';

const BASE_URL = '/lecturas';

export const getAllLecturas: () => Promise<Lectura[]> = async () => {
    const response = await axiosPrivate.get(`${BASE_URL}/all`);
    return response.data;
};

export const getTarifasLecturas = async (): Promise<TipoTarifaLectura[]> => {
    const response = await axiosPrivate.get(`${BASE_URL}/tarifas-lecturas`);
    return response.data;
};

export const getLecturasByUsuario = async (idUsuario: number): Promise<Lectura[]> => {
    const response = await axiosPrivate.get(`${BASE_URL}/usuario/${idUsuario}`);
    return response.data;
};

export const getLecturasByMedidor = async (idMedidor: number): Promise<Lectura[]> => {
    const response = await axiosPrivate.get(`${BASE_URL}/medidor/${idMedidor}`);
    return response.data;
};

export const getLecturasByAfiliado = async (idAfiliado: number): Promise<Lectura[]> => {
    const response = await axiosPrivate.get(`${BASE_URL}/afiliado/${idAfiliado}`);
    return response.data;
};

export const getLecturasEntreFechas = async (fechaInicio: string, fechaFin: string): Promise<Lectura[]> => {
    const response = await axiosPrivate.get(`${BASE_URL}/entre-fechas/${fechaInicio}/${fechaFin}`);
    return response.data;
};

export const importarCSVLecturas = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('CSV', file);
    
    const response = await axiosPrivate.post(`${BASE_URL}/cargar-csv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const createLectura = async (lectura: CreateLecturaDTO): Promise<Lectura> => {
    const response = await axiosPrivate.post(`${BASE_URL}/create`, lectura);
    return response.data;
};

export const updateLectura = async (idLectura: number, lectura: UpdateLecturaDTO): Promise<Lectura> => {
    const response = await axiosPrivate.put(`${BASE_URL}/update/${idLectura}`, lectura);
    return response.data;
};
