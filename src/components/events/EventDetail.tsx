import EventEditor from '@/components/events/EventEditor';
import PlayerEventDetail from '@/components/events/PlayerEventDetail';
import { useRole } from '@/hooks/useRole';

/** Mismo evento, dos vistas: el admin lo edita; el jugador ve su horario y sus tags. */
export default function EventDetail({ id }: { id: string }) {
  const { isAdmin } = useRole();
  return isAdmin ? <EventEditor id={id} /> : <PlayerEventDetail id={id} />;
}
