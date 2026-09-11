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
