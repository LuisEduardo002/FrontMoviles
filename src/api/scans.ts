/**
 * Endpoints del historial de escaneos (`scans_history`) para el panel admin.
 *
 * Si el backend expone otra ruta (ej. `/scans` o `/scans-history`), se cambia
 * SOLO el `PATH` de abajo. Mismo patrón que `users.ts` / `events.ts`.
 */

import { USE_MOCK } from '../config/env';
import type { CreateScanDto, ScanHistory, UpdateScanDto } from '../types';
import { request } from './client';
import * as mock from './mockStore';

const PATH = '/scans-history';

export function listScans(): Promise<ScanHistory[]> {
  if (USE_MOCK) return mock.mockListScans();
  return request<ScanHistory[]>(PATH);
}

export function getScan(id: string): Promise<ScanHistory> {
  if (USE_MOCK) return mock.mockGetScan(id);
  return request<ScanHistory>(`${PATH}/${id}`);
}

export function createScan(body: CreateScanDto): Promise<ScanHistory> {
  if (USE_MOCK) return mock.mockCreateScan(body);
  return request<ScanHistory>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateScan(id: string, patch: UpdateScanDto): Promise<ScanHistory> {
  if (USE_MOCK) return mock.mockUpdateScan(id, patch);
  return request<ScanHistory>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteScan(id: string): Promise<void> {
  if (USE_MOCK) return mock.mockDeleteScan(id);
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
