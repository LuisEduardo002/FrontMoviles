/**
 * Endpoints de eventos para el panel admin.
 * Ver `users.ts`: mismo patrón, solo cambia la ruta.
 */

import type { AdminEvent, CreateEventDto, UpdateEventDto } from '../types';
import { request } from './client';

const PATH = '/events';

export function listEvents(): Promise<AdminEvent[]> {
  return request<AdminEvent[]>(PATH);
}

export function getEvent(id: string): Promise<AdminEvent> {
  return request<AdminEvent>(`${PATH}/${id}`);
}

export function createEvent(body: CreateEventDto): Promise<AdminEvent> {
  return request<AdminEvent>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateEvent(id: string, patch: UpdateEventDto): Promise<AdminEvent> {
  return request<AdminEvent>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteEvent(id: string): Promise<void> {
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
