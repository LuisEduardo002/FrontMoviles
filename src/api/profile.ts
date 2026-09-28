/**
 * Perfil propio y ranking (/users/me, /users/ranking).
 *
 * A diferencia de `users.ts` (CRUD del admin), esto lo usa cualquier usuario.
 */

import type { AdminUser, MyProfile, Ranking } from '../types';
import { request } from './client';

export function getMyProfile(): Promise<MyProfile> {
  return request<MyProfile>('/users/me');
}

/** Sin evento, el ranking general; con evento, los puntos ganados en él. */
export function getRanking(eventId?: string): Promise<Ranking> {
  return request<Ranking>(eventId ? `/users/ranking?eventId=${eventId}` : '/users/ranking');
}

/**
 * POST /users/me/avatar con la foto ya recortada y comprimida (ver
 * `pickAvatar` en `src/utils/avatar.ts`). En web la foto llega como blob; en
 * el celular como archivo local, que React Native sube con `{ uri, name, type }`.
 */
export async function uploadAvatar(uri: string): Promise<AdminUser> {
  const form = new FormData();
  if (uri.startsWith('blob:') || uri.startsWith('data:')) {
    form.append('avatar', await (await fetch(uri)).blob(), 'avatar.jpg');
  } else {
    form.append('avatar', { uri, name: 'avatar.jpg', type: 'image/jpeg' } as unknown as Blob);
  }
  return request<AdminUser>('/users/me/avatar', form, 'POST');
}
