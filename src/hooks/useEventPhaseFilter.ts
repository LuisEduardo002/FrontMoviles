import { useMemo, useState } from 'react';
import type { AdminEvent } from '@/types';
import { eventPhase, type EventPhase } from '@/utils/events';

export const EVENT_PHASE_FILTERS = [
  { label: 'En curso', value: 'live' },
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Finalizados', value: 'ended' },
] as const;

/**
 * Filtro del jugador: los eventos de un momento (en curso, próximos,
 * finalizados) más búsqueda por texto. `totalInPhase` es para el "3 de 5".
 */
export function useEventPhaseFilter(events: AdminEvent[]) {
  const [phase, setPhase] = useState<EventPhase>('live');
  const [query, setQuery] = useState('');

  const inPhase = useMemo(() => events.filter((event) => eventPhase(event) === phase), [events, phase]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inPhase
      .filter((event) => !q || [event.name, event.description ?? ''].some((f) => f.toLowerCase().includes(q)))
      .sort((a, b) =>
        // Los próximos, del más cercano; el resto, del más reciente
        phase === 'upcoming' ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate),
      );
  }, [inPhase, phase, query]);

  return { phase, setPhase, query, setQuery, filtered, totalInPhase: inPhase.length };
}
