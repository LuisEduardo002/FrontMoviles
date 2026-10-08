import { listEvents } from '@/api/events';
import { useFocusLoad } from '@/hooks/useFocusLoad';

/** Todos los eventos. Se recargan al volver a la pantalla. */
export function useEvents() {
  const { data: events, ...state } = useFocusLoad(listEvents, []);
  return { events, ...state };
}
