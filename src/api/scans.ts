/**
 * Escaneos (/scans): registrar que se encontró un tag y el álbum propio.
 */

import type { MyScan, ScanRequest, ScanResult } from '../types';
import { request } from './client';

/**
 * POST /scans. El servidor decide si cuenta: rechaza con un mensaje propio si
 * el jugador está lejos, si ya lo había escaneado, si el código no existe o si
 * el evento no está vigente. Ese mensaje se muestra tal cual: el radio es
 * configurable en el backend y no debe repetirse aquí.
 */
export function registerScan(body: ScanRequest): Promise<ScanResult> {
  return request<ScanResult>('/scans', body, 'POST');
}

/** GET /scans/me: las cartas del jugador, de la más nueva a la más vieja. */
export function listMyScans(): Promise<MyScan[]> {
  return request<MyScan[]>('/scans/me');
}
