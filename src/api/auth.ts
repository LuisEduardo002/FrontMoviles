/**
 * Endpoints de autenticación (/auth). Es lo único que el backend expone hoy.
 *
 * No hay /auth/me ni ningún endpoint protegido: el `JwtAuthGuard` existe en el
 * backend pero no está puesto en ningún controlador. Por eso aquí no hay una
 * función para recargar el perfil — la sesión guardada se valida leyendo el
 * propio token (ver `src/session/jwt.ts`).
 */

import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { request } from './client';

/** POST /auth/login -> token de sesión y usuario. Responde 201, no 200. */
export function login(body: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', body);
}

/**
 * POST /auth/register -> crea el usuario y YA devuelve token.
 *
 * Por eso el registro no necesita un login posterior: con esta sola llamada la
 * sesión queda abierta. El apodo es único en la base igual que el correo, así
 * que el servidor puede rechazar cualquiera de los dos con un 409.
 */
export function register(body: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', body);
}
