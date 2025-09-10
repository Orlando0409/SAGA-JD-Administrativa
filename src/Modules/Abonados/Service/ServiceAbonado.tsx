import axiosPrivate from "@/Api/apiAuth";
import type { Abonado } from "../Models/ModelAbonado";

const API_URL = "/abonados"; // ya incluye el baseURL desde axiosPrivate

export const getAbonados = async (): Promise<Abonado[]> => {
    const response = await axiosPrivate.get<Abonado[]>(API_URL);
    return response.data;
};

export const deleteAbonado = async (id: number) => {
    await axiosPrivate.delete(`${API_URL}/${id}`);
};
