import { API_URL } from '@/config/env';
import { decodeJwt } from '@/session/jwt';
import { useSession } from '@/session/context';
import { formatDateTime } from '@/utils/format';

/** Datos de la sesión para mostrar: cuándo vence, a qué servidor apunta y salir. */
export function useSessionInfo() {
  const { user, token, logout } = useSession();
  const payload = token ? decodeJwt(token) : null;

  return {
    email: user?.email ?? null,
    expiresAt: payload ? formatDateTime(new Date(payload.exp * 1000).toISOString()) : null,
    apiUrl: API_URL,
    logout: () => void logout(),
  };
}
