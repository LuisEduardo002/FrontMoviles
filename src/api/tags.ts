/**
 * Endpoints de tags NFC (`nfc_tags`) para el panel admin.
 *
 * ÚNICO lugar donde viven las rutas de tags. Si el backend las nombra
 * distinto (ej. `/tags`), se cambia SOLO el `PATH` de abajo.
 *
 * Todos estos endpoints están protegidos: solo un usuario ADMIN puede
 * consumirlos. El JWT ya viaja automático en cada request (ver `client.ts`).
 *
 * OJO con el case: a diferencia del resto del backend, el GET responde en
 * snake_case (points_reward, is_hidden, clue_text, card_title,
 * card_image_url, card_fun_fact, event_id) porque sale de una consulta
 * PostGIS cruda, mientras que POST/PATCH sí esperan camelCase. `mapTag`
 * traduce la respuesta para que el resto de la app siga viendo camelCase.
 *
 * `event_id` llega como número (los eventos usan IDs numéricos, a diferencia
 * del UUID de los tags); se guarda como string en `NfcTag.eventId` para
 * calcar `AdminEvent.id` y se vuelve a convertir a número al enviarlo.
 */

import type { CreateTagDto, CreateTagResult, NfcTag, UpdateTagDto } from '../types';
import { request } from './client';

const PATH = '/nfc-tags';

interface RawNfcTag {
  id: string;
  code: string;
  name: string;
  description: string | null;
  points_reward: number;
  latitude: number;
  longitude: number;
  is_hidden: boolean;
  clue_text: string | null;
  card_title: string | null;
  card_image_url: string | null;
  card_fun_fact: string | null;
  event_id: number | null;
}

function mapTag(raw: RawNfcTag): NfcTag {
  return {
    id: raw.id,
    code: raw.code,
    name: raw.name,
    description: raw.description,
    pointsReward: raw.points_reward,
    latitude: raw.latitude,
    longitude: raw.longitude,
    isHidden: raw.is_hidden,
    clueText: raw.clue_text,
    cardTitle: raw.card_title,
    cardImageUrl: raw.card_image_url,
    cardFunFact: raw.card_fun_fact,
    eventId: raw.event_id == null ? null : String(raw.event_id),
  };
}

export async function listTags(): Promise<NfcTag[]> {
  const rows = await request<RawNfcTag[]>(PATH);
  return rows.map(mapTag);
}

export async function getTag(id: string): Promise<NfcTag> {
  const row = await request<RawNfcTag>(`${PATH}/${id}`);
  return mapTag(row);
}

export function createTag(body: CreateTagDto): Promise<CreateTagResult> {
  return request<CreateTagResult>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export async function updateTag(id: string, patch: UpdateTagDto): Promise<void> {
  await request<unknown>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteTag(id: string): Promise<void> {
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
