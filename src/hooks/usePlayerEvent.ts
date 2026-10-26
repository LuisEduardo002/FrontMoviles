import { useCallback } from 'react';
import { getEvent } from '@/api/events';
import { listPlayerTags } from '@/api/tags';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { AdminEvent, PlayerTag } from '@/types';
import { eventPhase } from '@/utils/events';

/** Un evento visto por el jugador: el evento, sus tags y cuántos encontró. */
export function usePlayerEvent(id: string) {
  const load = useCallback(async () => {
    const [event, tags] = await Promise.all([getEvent(id), listPlayerTags(id)]);
    // Primero lo que falta por encontrar
    tags.sort((a, b) => Number(a.foundByMe) - Number(b.foundByMe));
    return { event, tags };
  }, [id]);
  const { data, ...state } = useFocusLoad<{ event: AdminEvent | null; tags: PlayerTag[] }>(load, {
    event: null,
    tags: [],
  });

  return {
    event: data.event,
    tags: data.tags,
    phase: data.event ? eventPhase(data.event) : null,
    found: data.tags.filter((tag) => tag.foundByMe).length,
    ...state,
  };
}
