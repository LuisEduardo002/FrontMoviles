import { useSession } from '@/session/context';

/**
 * El rol de quien usa la app. Las rutas que comparten admin y jugador
 * (inicio, perfil, detalle de evento) eligen su pantalla con esto.
 */
export function useRole() {
  const { user } = useSession();
  return { isAdmin: user?.role === 'ADMIN', user };
}
