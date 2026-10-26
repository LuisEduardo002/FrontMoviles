import { useMemo } from 'react';
import { listEvents } from '@/api/events';
import { listTags } from '@/api/tags';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { AdminEvent, NfcTag } from '@/types';

/** Los eventos solo ponen nombre al tag: si fallan, la lista de tags sigue. */
async function loadTags() {
  const [tags, events] = await Promise.all([listTags(), listEvents().catch(() => [] as AdminEvent[])]);
  return { tags, events };
}

/** Todos los tags (vista del admin) y el nombre del evento de cada uno. */
export function useTags() {
  const { data, ...state } = useFocusLoad(loadTags, { tags: [] as NfcTag[], events: [] as AdminEvent[] });

  const eventNames = useMemo(
    () => new Map(data.events.map((event) => [event.id, event.name])),
    [data.events],
  );

  return {
    tags: data.tags,
    eventName: (tag: NfcTag) => (tag.eventId ? eventNames.get(tag.eventId) : undefined),
    ...state,
  };
}
