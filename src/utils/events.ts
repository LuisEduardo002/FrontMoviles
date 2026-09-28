import type { AdminEvent } from '../types';

/**
 * En qué momento está un evento para el jugador. Un evento inactivo cuenta
 * como finalizado aunque esté en fechas: el backend no deja escanear en él.
 */
export type EventPhase = 'live' | 'upcoming' | 'ended';

export function eventPhase(event: AdminEvent, now = new Date()): EventPhase {
  if (!event.isActive || new Date(event.endDate) < now) return 'ended';
  if (new Date(event.startDate) > now) return 'upcoming';
  return 'live';
}

export const PHASE_LABEL: Record<EventPhase, string> = {
  live: 'En curso',
  upcoming: 'Próximo',
  ended: 'Finalizado',
};

/** Tono del `Badge` de cada fase: en curso resalta, finalizado se apaga. */
export const PHASE_TONE = {
  live: 'primary',
  upcoming: 'secondary',
  ended: 'muted',
} as const satisfies Record<EventPhase, 'primary' | 'secondary' | 'muted'>;
