import { useMemo, useState } from 'react';
import type { AdminEvent } from '@/types';

export type EventStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export const EVENT_STATUS_FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Activos', value: 'ACTIVE' },
  { label: 'Inactivos', value: 'INACTIVE' },
] as const;

/** Búsqueda por texto y filtro por estado de la lista de eventos del admin. */
export function useEventFilters(events: AdminEvent[]) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<EventStatusFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((event) => {
      if (status === 'ACTIVE' && !event.isActive) return false;
      if (status === 'INACTIVE' && event.isActive) return false;
      if (!q) return true;
      return [event.name, event.description ?? ''].some((field) => field.toLowerCase().includes(q));
    });
  }, [events, query, status]);

  return { query, setQuery, status, setStatus, filtered };
}
