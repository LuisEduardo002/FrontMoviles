/**
 * Endpoints de autenticación (prefijo /api/auth).
 *
 * El backend expone los campos en inglés y con los mismos nombres que usa la
 * app, así que aquí no hay traducción: las funciones existen para que las
 * pantallas no tengan que conocer rutas ni formas de JSON.
 */

import type { User } from '../types';
import { request } from './client';

/** Respuesta de /register y /login: el token y el usuario que entró. */
interface SessionResponse {
  token: string;
  user: User;
}

/** POST /auth/login -> token de sesión y usuario. */
export function login(email: string, password: string): Promise<SessionResponse> {
  return request<SessionResponse>('/auth/login', { email, password });
}

/**
 * POST /auth/register -> crea el usuario y YA devuelve token.
 *
 * Por eso el registro no necesita un login posterior: con esta sola llamada la
 * sesión queda abierta.
 */
export function register(
  name: string,
  email: string,
  password: string,
): Promise<SessionResponse> {
  return request<SessionResponse>('/auth/register', { name, email, password });
}

/** GET /auth/me -> el usuario de la sesión actual. Requiere token. */
export function profile(): Promise<User> {
  return request<User>('/auth/me');
}
