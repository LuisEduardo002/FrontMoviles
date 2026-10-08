import { useMemo, useState } from 'react';
import type { AdminUser, Role } from '@/types';

export type UserRoleFilter = 'ALL' | Role;

export const USER_ROLE_FILTERS = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Jugadores', value: 'USER' },
  { label: 'Admins', value: 'ADMIN' },
] as const;

/** Búsqueda por apodo, correo o nivel y filtro por rol. */
export function useUserFilters(users: AdminUser[]) {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<UserRoleFilter>('ALL');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (role !== 'ALL' && user.role !== role) return false;
      if (!q) return true;
      return [user.nickname, user.email, user.levelTitle ?? ''].some((field) => field.toLowerCase().includes(q));
    });
  }, [users, query, role]);

  return { query, setQuery, role, setRole, filtered };
}
