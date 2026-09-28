/**
 * Endpoints de eventos para el panel admin.
 * Ver `users.ts`: mismo patrón, solo cambia la ruta.
 *
 * El backend responde el `id` como número (autoincremental). Aquí se pasa a
 * string para que coincida con `AdminEvent.id`, con los parámetros de ruta y
 * con `NfcTag.eventId`; si no, `event.id === tag.eventId` nunca es cierto.
 */

import type { AdminEvent, CreateEventDto, UpdateEventDto } from '../types';
import { request } from './client';

const PATH = '/events';

type RawEvent = Omit<AdminEvent, 'id'> & { id: number | string };

const mapEvent = (raw: RawEvent): AdminEvent => ({ ...raw, id: String(raw.id) });

export async function listEvents(): Promise<AdminEvent[]> {
  return (await request<RawEvent[]>(PATH)).map(mapEvent);
}

export async function getEvent(id: string): Promise<AdminEvent> {
  return mapEvent(await request<RawEvent>(`${PATH}/${id}`));
}

export async function createEvent(body: CreateEventDto): Promise<AdminEvent> {
  return mapEvent(await request<RawEvent>(PATH, body, 'POST'));
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export async function updateEvent(id: string, patch: UpdateEventDto): Promise<AdminEvent> {
  return mapEvent(await request<RawEvent>(`${PATH}/${id}`, patch, 'PATCH'));
}

export async function deleteEvent(id: string): Promise<void> {
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
