/**
 * Endpoints del historial de escaneos (`scans_history`) para el panel admin.
 *
 * Si el backend expone otra ruta (ej. `/scans` o `/scans-history`), se cambia
 * SOLO el `PATH` de abajo. Mismo patrón que `users.ts` / `events.ts`.
 */

import { USE_MOCK_SCANS } from '../config/env';
import type { AdminUser, CreateScanDto, ScanHistory, UpdateScanDto } from '../types';
import { request } from './client';
import { listUsers } from './users';
import * as mock from './mockStore';

const PATH = '/scans-history';

/** Usa la misma fuente de usuarios que los escaneos para no mezclar IDs reales y mock. */
export function listScanUsers(): Promise<AdminUser[]> {
  if (USE_MOCK_SCANS) return mock.mockListUsers();
  return listUsers();
}

export function listScans(): Promise<ScanHistory[]> {
  if (USE_MOCK_SCANS) return mock.mockListScans();
  return request<ScanHistory[]>(PATH);
}

export function getScan(id: string): Promise<ScanHistory> {
  if (USE_MOCK_SCANS) return mock.mockGetScan(id);
  return request<ScanHistory>(`${PATH}/${id}`);
}

export function createScan(body: CreateScanDto): Promise<ScanHistory> {
  if (USE_MOCK_SCANS) return mock.mockCreateScan(body);
  return request<ScanHistory>(PATH, body, 'POST');
}

/** Solo se envían los campos que cambiaron (el llamador filtra con dirtyFields). */
export function updateScan(id: string, patch: UpdateScanDto): Promise<ScanHistory> {
  if (USE_MOCK_SCANS) return mock.mockUpdateScan(id, patch);
  return request<ScanHistory>(`${PATH}/${id}`, patch, 'PATCH');
}

export async function deleteScan(id: string): Promise<void> {
  if (USE_MOCK_SCANS) return mock.mockDeleteScan(id);
  await request<void>(`${PATH}/${id}`, undefined, 'DELETE');
}
