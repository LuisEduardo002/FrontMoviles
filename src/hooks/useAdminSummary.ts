import { useMemo } from 'react';
import { listEvents } from '@/api/events';
import { listTags } from '@/api/tags';
import { listUsers } from '@/api/users';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { AdminEvent, AdminUser, NfcTag } from '@/types';

/** Si una de las tres listas falla, el resto del panel se sigue mostrando. */
async function loadSummary() {
  const [users, events, tags] = await Promise.allSettled([listUsers(), listEvents(), listTags()]);
  const value = <T,>(result: PromiseSettledResult<T[]>) => (result.status === 'fulfilled' ? result.value : []);
  return {
    users: value(users),
    events: value(events),
    tags: value(tags),
    failed: [users, events, tags].some((result) => result.status === 'rejected'),
  };
}

/** Las cifras del panel del admin: eventos activos, tags y jugadores. */
export function useAdminSummary() {
  const { data, ...state } = useFocusLoad(loadSummary, {
    users: [] as AdminUser[],
    events: [] as AdminEvent[],
    tags: [] as NfcTag[],
    failed: false,
  });

  const summary = useMemo(() => {
    const players = data.users.filter((user) => user.role === 'USER').length;
    return {
      activeEvents: data.events.filter((event) => event.isActive),
      totalEvents: data.events.length,
      totalTags: data.tags.length,
      hiddenTags: data.tags.filter((tag) => tag.isHidden).length,
      players,
      admins: data.users.length - players,
    };
  }, [data]);

  /** Cuántos tags tiene un evento. */
  const tagsInEvent = (eventId: string) => data.tags.filter((tag) => tag.eventId === eventId).length;

  return { ...summary, tagsInEvent, partialFailure: data.failed, ...state };
}
