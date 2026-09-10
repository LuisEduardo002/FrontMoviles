/**
 * Endpoints de usuarios (prefijo /api/users). Todos exigen token.
 *
 * Hoy el backend solo expone lectura: listado y detalle. La creación ocurre por
 * /auth/register, y todavía no hay editar ni borrar.
 */

import type { User } from '../types';
import { request } from './client';

/** GET /users -> todos los usuarios registrados. */
export function listUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

/** GET /users/:id -> un usuario concreto. */
export function getUser(id: number): Promise<User> {
  return request<User>(`/users/${id}`);
}
