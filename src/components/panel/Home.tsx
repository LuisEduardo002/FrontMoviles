import PlayerEventList from '@/components/events/PlayerEventList';
import AdminPanel from '@/components/panel/AdminPanel';
import { useRole } from '@/hooks/useRole';

/** Primer tab: el panel para el admin, los eventos para el jugador. */
export default function Home() {
  const { isAdmin } = useRole();
  return isAdmin ? <AdminPanel /> : <PlayerEventList />;
}
