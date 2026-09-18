/**
 * El contrato con la API de NFHunter, en tipos.
 *
 * Todo lo que entra o sale del backend pasa por aquí. Los nombres son los del
 * servidor (NestJS + Prisma, siempre camelCase), así que no hay traducción: si
 * el backend renombra un campo, se ajusta en `src/api/`, que es la única capa
 * que habla con él.
 */

/**
 * Rol del usuario. En la base es `enum Role { USER, ADMIN }` con USER por
 * defecto, así que la lista está cerrada: si llegara otro valor, sería un
 * cambio del backend que hay que reflejar aquí.
 */
export const ROLES = ['USER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

/**
 * El usuario tal como lo devuelve /auth. Son EXACTAMENTE estos tres campos.
 *
 * La tabla `users` tiene además `nickname`, `avatarUrl`, `levelTitle` y
 * `totalPoints`, pero NINGÚN endpoint los expone hoy. Si una pantalla los
 * necesita, hay que agregarlos en el backend: no se inventan aquí ni se
 * guardan localmente como si vinieran del servidor.
 */
export interface AuthUser {
  /** `uuid` de Postgres: es un string, no un número. */
  id: string;
  email: string;
  role: Role;
}

/** Cuerpo de POST /auth/login. */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Cuerpo de POST /auth/register. El apodo es único, igual que el correo. */
export interface RegisterRequest {
  nickname: string;
  email: string;
  password: string;
}

/**
 * Respuesta de /auth/login y /auth/register (ambas responden 201).
 *
 * La llave del token es `access_token` —así la nombra NestJS—, no `token`.
 */
export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

/**
 * Forma de CUALQUIER error del backend.
 *
 * `message` es un string cuando la excepción la lanza el servicio a mano
 * (`ConflictException('El correo ya está registrado.')`) y un arreglo con un
 * texto por campo cuando se active el ValidationPipe. `error` es solo el nombre
 * en inglés del código HTTP ("Conflict", "Unauthorized"): no sirve para mostrar.
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

/**
 * Lo que viaja firmado dentro del JWT (`payload` en auth.service.ts).
 *
 * Importante: el id del usuario está en `sub`, no en `id`. `exp` e `iat` son
 * segundos desde 1970 (no milisegundos), que es como los escribe el estándar.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

// ---------------------------------------------------------------------------
// Entidades del panel de administración.
// Nombres de campo en camelCase, igual que los expone NestJS + Prisma.
// Cuando el backend exista, estos tipos deben calcar su JSON: la única capa
// que traduce es `src/api/`.
// ---------------------------------------------------------------------------

/** Fila de `users` tal como la administra el panel. */
export interface AdminUser {
  id: string;
  nickname: string;
  email: string;
  role: Role;
  totalPoints: number;
  levelTitle: string | null;
  createdAt: string;
}

/** POST /users. La contraseña solo viaja al crear (nunca vuelve del server). */
export interface CreateUserDto {
  nickname: string;
  email: string;
  password: string;
  role: Role;
  levelTitle: string;
}

/** PATCH /users/:id. Solo los campos presentes se actualizan. */
export interface UpdateUserDto {
  nickname?: string;
  email?: string;
  password?: string;
  role?: Role;
  levelTitle?: string;
  totalPoints?: number;
  avatarUrl?: string;
}

/** Fila de `events`: agrupa actividades (festival, temporada, rally...). */
export interface AdminEvent {
  id: string;
  name: string;
  description: string | null;
  /** ISO 8601 (`2026-03-01`). En formularios se captura como texto YYYY-MM-DD. */
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEventDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export type UpdateEventDto = Partial<CreateEventDto>;

// ---------------------------------------------------------------------------
// Tags NFC (tabla `nfc_tags`).
// A diferencia del resto del backend, este recurso ROMPE la convención
// camelCase: el GET devuelve columnas snake_case (herencia de la consulta
// PostGIS cruda), mientras que POST/PATCH sí esperan camelCase. Por eso la
// traducción snake_case -> camelCase vive en `src/api/tags.ts` (ver `mapTag`)
// y estos tipos representan la forma ya traducida (camelCase) que usa el resto
// de la app.
// `id` es un UUID (string); a diferencia de los tags, los eventos usan IDs
// numéricos, así que `eventId` viaja como número hacia el backend aunque en
// el panel se maneje como string (igual que `AdminEvent.id`).
// ---------------------------------------------------------------------------

/** Fila de `nfc_tags` tal como la administra el panel (ya en camelCase). */
export interface NfcTag {
  id: string;
  code: string;
  name: string;
  description: string | null;
  pointsReward: number;
  latitude: number;
  longitude: number;
  isHidden: boolean;
  clueText: string | null;
  cardTitle: string | null;
  cardImageUrl: string | null;
  cardFunFact: string | null;
  eventId: string | null;
}

/** POST /nfc-tags. Solo `code`, `name`, `latitude` y `longitude` son obligatorios. */
export interface CreateTagDto {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  pointsReward?: number;
  isHidden?: boolean;
  clueText?: string;
  cardTitle?: string;
  cardImageUrl?: string;
  cardFunFact?: string;
  eventId?: number;
}

/** PATCH /nfc-tags/:id. Solo los campos presentes se actualizan. */
export type UpdateTagDto = Partial<CreateTagDto>;

/** 201 de POST /nfc-tags: el backend solo confirma id, code y name. */
export interface CreateTagResult {
  id: string;
  code: string;
  name: string;
}
