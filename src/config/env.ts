import { Platform } from 'react-native';

/**
 * Configuración de entorno. Es el ÚNICO lugar donde vive la dirección del
 * backend: si cambia la IP, se cambia aquí (o en `.env`) y nada más.
 */

/**
 * Dirección del backend de NFHunter (NestJS, puerto 3000).
 *
 * Va SIN `/api`: el servidor no define un prefijo global y sus controladores
 * cuelgan de la raíz, así que las rutas son `/auth/login` y `/auth/register`.
 *
 * En la Web (navegador en la misma PC) siempre se conecta a localhost:3000
 * para evitar bloqueos de red local o firewall de Windows.
 * En celular físico (Expo Go), se usa la IP de red local de `.env`.
 */
export const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000');

/** Cuánto se espera una respuesta antes de darla por perdida (10 segundos). */
export const REQUEST_TIMEOUT_MS = 10_000;

/**
 * URL completa de un archivo que el backend guarda con ruta relativa (fotos de
 * perfil: "/uploads/avatars/..."). Se arma aquí para que siga funcionando
 * cuando cambie la IP del servidor.
 */
export function assetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return /^https?:\/\//.test(path) ? path : `${API_URL}${path}`;
}
