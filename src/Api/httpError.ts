import { AxiosError } from 'axios';

export const TOO_MANY_REQUESTS_TITLE = 'Demasiados intentos';
export const TOO_MANY_REQUESTS_MSG =
  'Has hecho demasiadas solicitudes. Espera un momento e inténtalo de nuevo.';

/** Detecta respuestas 429 (rate limit del backend / ThrottlerGuard). */
export function isTooManyRequests(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 429;
}
