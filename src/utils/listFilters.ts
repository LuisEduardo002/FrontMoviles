import type { AdminEvent, AdminUser, NfcTag, Role } from '@/types';
import { eventPhase, type EventPhase } from '@/utils/events';

/**
 * Cómo se filtra una lista: las opciones del `Segmented`, cuál empieza
 * elegida, en qué campos busca el texto y qué items deja pasar cada opción.
 * Tienen que ser constantes de módulo para que `useListFilter` no recalcule.
 */
export interface ListFilter<T, F extends string> {
  options: readonly { label: string; value: F }[];
  initial: F;
  searchFields: (item: T) => (string | null | undefined)[];
  matches: (item: T, filter: F) => boolean;
  sort?: (a: T, b: T, filter: F) => number;
}

export type EventStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

/** Eventos del admin: búsqueda por nombre o descripción y filtro por estado. */
export const EVENT_STATUS_FILTER: ListFilter<AdminEvent, EventStatusFilter> = {
  options: [
    { label: 'Todos', value: 'ALL' },
    { label: 'Activos', value: 'ACTIVE' },
    { label: 'Inactivos', value: 'INACTIVE' },
  ],
  initial: 'ALL',
  searchFields: (event) => [event.name, event.description],
  matches: (event, status) => status === 'ALL' || event.isActive === (status === 'ACTIVE'),
};

export type UserRoleFilter = 'ALL' | Role;

/** Usuarios: búsqueda por apodo, correo o nivel y filtro por rol. */
export const USER_ROLE_FILTER: ListFilter<AdminUser, UserRoleFilter> = {
  options: [
    { label: 'Todos', value: 'ALL' },
    { label: 'Jugadores', value: 'USER' },
    { label: 'Admins', value: 'ADMIN' },
  ],
  initial: 'ALL',
  searchFields: (user) => [user.nickname, user.email, user.levelTitle],
  matches: (user, role) => role === 'ALL' || user.role === role,
};

export type TagVisibilityFilter = 'ALL' | 'VISIBLE' | 'HIDDEN';

/** Tags: búsqueda por código, nombre o pista y filtro por visibilidad. */
export const TAG_VISIBILITY_FILTER: ListFilter<NfcTag, TagVisibilityFilter> = {
  options: [
    { label: 'Todos', value: 'ALL' },
    { label: 'Visibles', value: 'VISIBLE' },
    { label: 'Ocultos', value: 'HIDDEN' },
  ],
  initial: 'ALL',
  searchFields: (tag) => [tag.code, tag.name, tag.description, tag.clueText],
  matches: (tag, visibility) => visibility === 'ALL' || tag.isHidden === (visibility === 'HIDDEN'),
};

/** Eventos del jugador: los de un momento (en curso, próximos, finalizados) más búsqueda por texto. */
export const EVENT_PHASE_FILTER: ListFilter<AdminEvent, EventPhase> = {
  options: [
    { label: 'En curso', value: 'live' },
    { label: 'Próximos', value: 'upcoming' },
    { label: 'Finalizados', value: 'ended' },
  ],
  initial: 'live',
  searchFields: (event) => [event.name, event.description],
  matches: (event, phase) => eventPhase(event) === phase,
  // Los próximos, del más cercano; el resto, del más reciente
  sort: (a, b, phase) =>
    phase === 'upcoming' ? a.startDate.localeCompare(b.startDate) : b.startDate.localeCompare(a.startDate),
};
