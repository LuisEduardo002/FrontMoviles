import AdminProfile from '@/components/profile/AdminProfile';
import PlayerProfile from '@/components/profile/PlayerProfile';
import { useRole } from '@/hooks/useRole';

/** El jugador ve su álbum; el admin, los datos de su sesión. */
export default function Profile() {
  const { isAdmin } = useRole();
  return isAdmin ? <AdminProfile /> : <PlayerProfile />;
}
