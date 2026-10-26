import { useCallback, useState } from 'react';
import { listEvents } from '@/api/events';
import { getRanking } from '@/api/profile';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import { useSession } from '@/session/context';
import type { AdminEvent, Ranking } from '@/types';
import { eventPhase } from '@/utils/events';

/**
 * Ranking de cazadores: general (sin evento) o de un evento en curso. Al
 * cambiar `eventId` se recarga solo. `meOutsideTop` es el puesto propio
 * cuando no aparece en el top.
 */
export function useRanking() {
  const { user } = useSession();
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    const [ranking, events] = await Promise.all([getRanking(eventId), listEvents().catch(() => [] as AdminEvent[])]);
    return { ranking, liveEvents: events.filter((event) => eventPhase(event) === 'live') };
  }, [eventId]);
  const { data, ...state } = useFocusLoad<{ ranking: Ranking; liveEvents: AdminEvent[] }>(load, {
    ranking: { top: [], me: null },
    liveEvents: [],
  });

  const { top, me } = data.ranking;
  return {
    top,
    meOutsideTop: me && !top.some((entry) => entry.id === me.id) ? me : null,
    isMe: (id: string) => id === user?.id,
    liveEvents: data.liveEvents,
    eventId,
    setEventId,
    ...state,
  };
}
