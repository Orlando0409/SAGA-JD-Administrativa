import type { Usuario } from '../../Usuarios/Models/Usuario'
import type { LoginForm } from '../Models/LoginForm';
import axiosPrivate from '../../../Api/apiAuth'
import { cookieUtils } from '../../../utils/CookieUtils';


export async function loginUser(LoginForm: LoginForm): Promise<Usuario> {
    const response = await axiosPrivate.post(`/auth/login`, LoginForm);
    return response.data;
}
export async function ForgotPassword(Email: string): Promise<string> {
    const response = await axiosPrivate.post(`/auth/forgot-password`, { Email });
    return response.data;
}
export async function ResetPassword(nuevaContraseña: string): Promise<boolean> {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const payload = {
    token, // el token de la URL
    nuevaContraseña,
    };
    const response = await axiosPrivate.post(`/auth/reset-password`, payload);
    return response.data;
}

export async function logoutUser(): Promise<void> {
    try {
        await axiosPrivate.post(`/auth/logout`);
    } finally {
        // Limpiar cookies del frontend (por si acaso)
        cookieUtils.removeToken()
    }
}
export async function verifyUser(): Promise<boolean> {
    const response = await axiosPrivate.get(`/auth/me`);
    return response.data;
}

export async function getCurrentUser(): Promise<Usuario> {
    const response = await axiosPrivate.get(`/auth/me`);
    return response.data;
}