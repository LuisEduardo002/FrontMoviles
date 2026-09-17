/**
 * Endpoints de tags NFC (`nfc_tags`) para el panel admin.
 *
 * ÚNICO lugar donde viven las rutas de tags. Si el backend las nombra
 * distinto (ej. `/tags`), se cambia SOLO el `PATH` de abajo.
 *
 * La columna `location` en la base es `geography(Point, 4326)` (PostGIS);
 * aquí viaja como texto "lat,lng" y el backend hace la conversión.
 */

import type { CreateTagDto, NfcTag, UpdateTagDto } from '../types';
import { request } from './client';

const PATH = '/nfc-tags';

export function listTags(): Promise<NfcTag[]> {
  return request<NfcTag[]>(PATH);
}

export function getTag(id: string): Promise<NfcTag> {
  return request<NfcTag>(`${PATH}/${id}`);
}

export function createTag(body: CreateTagDto): Promise<NfcTag> {
  return request<NfcTag>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateTag(id: string, patch: UpdateTagDto): Promise<NfcTag> {
  return request<NfcTag>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteTag(id: string): Promise<void> {
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
