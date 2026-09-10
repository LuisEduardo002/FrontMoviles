/**
 * El vocabulario de la app.
 *
 * El backend (helpdesk-uam-node) expone sus campos en inglés —`name`, `email`,
 * `role`— así que aquí no hay traducción que hacer: los tipos son un espejo del
 * `UserDTO` del servidor. Si el servidor renombra un campo, se ajusta en
 * `src/api/`, que es la única capa que habla con él.
 */

/**
 * Rol del usuario. En el backend la columna es `role TEXT DEFAULT 'user'`: no
 * hay lista cerrada todavía, por eso aquí es un string libre y no una unión de
 * valores. Cuando el servidor fije el catálogo de roles, se cierra aquí también.
 */
export type Role = string;

/** Usuario de la sesión. Nunca incluye la contraseña ni su hash (el DTO la omite). */
export interface User {
  /** `serial` en Postgres: es un número, no un UUID. */
  id: number;
  name: string;
  email: string;
  role: Role;
  /** ISO 8601, tal como lo serializa el backend. */
  createdAt: string;
}

// --- Tickets ---------------------------------------------------------------

export const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = [
  'NUEVO',
  'ASIGNADO',
  'EN_PROCESO',
  'ESPERA_INFORMACION',
  'RESUELTO',
  'CERRADO',
] as const;
export type TicketStatus = (typeof STATUSES)[number];

/**
 * Catálogo de categorías (F03 del documento de visión): la categoría es la que
 * determina el SLA y el grupo de agentes competentes.
 *
 * Está quemado aquí porque el backend todavía no expone el catálogo. Cuando
 * exista F04 ("catálogo configurable"), esta lista se pedirá al servidor.
 */
export const CATEGORIES = [
  'RED',
  'AULAS',
  'CREDENCIALES',
  'PLATAFORMA_ACADEMICA',
  'OTRO',
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Lo que el usuario llena en el formulario de una nueva solicitud. */
export interface NewTicket {
  subject: string;
  description: string;
  category: Category;
  priority: Priority;
}

/** Un ticket ya registrado en el servidor. */
export interface Ticket extends NewTicket {
  id: string;
  status: TicketStatus;
  requesterId: string;
  agentId: string | null;
}
