/**
 * Endpoints de usuarios para el panel admin.
 *
 * ÚNICO lugar donde viven las rutas de users. Si el backend las nombra
 * distinto (ej. `/api/users`), se cambia SOLO el `PATH` de abajo.
 * Con `EXPO_PUBLIC_USE_MOCK=false` estas funciones hablan con el servidor;
 * con `true` usan el almacén en memoria (ver `mockStore.ts`).
 */

import { USE_MOCK } from '../config/env';
import type { AdminUser, CreateUserDto, UpdateUserDto } from '../types';
import { ApiRequestError, request } from './client';
import * as mock from './mockStore';

const PATH = '/users';

export function listUsers(): Promise<AdminUser[]> {
  if (USE_MOCK) return mock.mockListUsers();
  return request<AdminUser[]>(PATH);
}

export function getUser(id: string): Promise<AdminUser> {
  if (USE_MOCK) return mock.mockGetUser(id);
  return request<AdminUser>(`${PATH}/${id}`);
}

export function createUser(body: CreateUserDto): Promise<AdminUser> {
  if (USE_MOCK) return mock.mockCreateUser(body);
  return request<AdminUser>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateUser(id: string, patch: UpdateUserDto): Promise<AdminUser> {
  if (USE_MOCK) return mock.mockUpdateUser(id, patch);
  return request<AdminUser>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteUser(id: string): Promise<void> {
  if (!UUID_RE.test(id)) {
    throw new ApiRequestError('El identificador del usuario no tiene formato UUID.', 400);
  }

  if (USE_MOCK) return mock.mockDeleteUser(id);
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
