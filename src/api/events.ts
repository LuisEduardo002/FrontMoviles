/**
 * Endpoints de eventos para el panel admin.
 * Ver `users.ts`: mismo patrón, solo cambia la ruta.
 */

import { USE_MOCK } from '../config/env';
import type { AdminEvent, CreateEventDto, UpdateEventDto } from '../types';
import { request } from './client';
import * as mock from './mockStore';

const PATH = '/events';

export function listEvents(): Promise<AdminEvent[]> {
  if (USE_MOCK) return mock.mockListEvents();
  return request<AdminEvent[]>(PATH);
}

export function getEvent(id: string): Promise<AdminEvent> {
  if (USE_MOCK) return mock.mockGetEvent(id);
  return request<AdminEvent>(`${PATH}/${id}`);
}

export function createEvent(body: CreateEventDto): Promise<AdminEvent> {
  if (USE_MOCK) return mock.mockCreateEvent(body);
  return request<AdminEvent>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateEvent(id: string, patch: UpdateEventDto): Promise<AdminEvent> {
  if (USE_MOCK) return mock.mockUpdateEvent(id, patch);
  return request<AdminEvent>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteEvent(id: string): Promise<void> {
  if (USE_MOCK) return mock.mockDeleteEvent(id);
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
