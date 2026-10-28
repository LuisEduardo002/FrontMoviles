import { useMemo } from 'react';
import { listEvents } from '@/api/events';
import { listPlayerTags } from '@/api/tags';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { AdminEvent, PlayerTag } from '@/types';

export interface EventProgress {
  found: number;
  total: number;
}

/** Los tags solo dan el progreso: si fallan, los eventos se siguen mostrando. */
async function loadPlayerEvents() {
  const [events, tags] = await Promise.all([listEvents(), listPlayerTags().catch(() => [] as PlayerTag[])]);
  return { events, tags };
}

/** Los eventos para el jugador, con cuántos tags lleva de cada uno. */
export function usePlayerEvents() {
  const { data, ...state } = useFocusLoad(loadPlayerEvents, {
    events: [] as AdminEvent[],
    tags: [] as PlayerTag[],
  });

  const progress = useMemo(() => {
    const byEvent = new Map<string, EventProgress>();
    for (const tag of data.tags) {
      if (!tag.eventId) continue;
      const entry = byEvent.get(tag.eventId) ?? { found: 0, total: 0 };
      entry.total += 1;
      if (tag.foundByMe) entry.found += 1;
      byEvent.set(tag.eventId, entry);
    }
    return byEvent;
  }, [data.tags]);

  return { events: data.events, progress, ...state };
}
