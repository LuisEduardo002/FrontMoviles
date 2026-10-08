import { listUsers } from '@/api/users';
import { useFocusLoad } from '@/hooks/useFocusLoad';

/** Todos los usuarios (solo ADMIN). Se recargan al volver a la pantalla. */
export function useUsers() {
  const { data: users, ...state } = useFocusLoad(listUsers, []);
  return { users, ...state };
}
