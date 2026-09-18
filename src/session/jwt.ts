/**
 * Lectura local del token de sesión.
 *
 * El backend no tiene ningún endpoint protegido (el `JwtAuthGuard` está escrito
 * pero no se usa), así que NO hay forma de preguntarle si un token guardado
 * sigue sirviendo. La única alternativa es abrirlo aquí y mirar su fecha de
 * vencimiento.
 *
 * Esto NO es validar el token: la firma no se verifica —para eso hace falta el
 * secreto, que vive solo en el servidor—. Sirve para no arrancar la app con una
 * sesión que ya sabemos vencida. Quien decide de verdad es el backend, el día
 * que proteja una ruta.
 */

import type { JwtPayload, Role } from '../types';
import { ROLES } from '../types';

/**
 * Un JWT son tres partes separadas por puntos: cabecera, contenido y firma.
 * Solo interesa la del medio, que es JSON codificado en base64url.
 */
function decodeSegment(segment: string): unknown {
  // base64url cambia "+" por "-" y "/" por "_", y se come el relleno final;
  // `atob` espera base64 normal, así que hay que deshacer esos cambios.
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    segment.length + ((4 - (segment.length % 4)) % 4),
    '=',
  );

  // `atob` devuelve un byte por carácter. Para que las tildes de un correo no
  // salgan rotas, esos bytes se vuelven a leer como UTF-8.
  const binary = atob(base64);
  const utf8 = decodeURIComponent(
    Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
  );

  return JSON.parse(utf8);
}

/** Comprueba que lo que venía dentro del token tenga la forma que esperamos. */
function isJwtPayload(value: unknown): value is JwtPayload {
  if (typeof value !== 'object' || value === null) return false;

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sub === 'string' &&
    typeof payload.email === 'string' &&
    typeof payload.exp === 'number' &&
    typeof payload.iat === 'number' &&
    ROLES.includes(payload.role as Role)
  );
}

/**
 * Abre el token y devuelve su contenido, o null si está roto o no tiene la
 * forma esperada (por ejemplo, un token viejo de otro backend).
 */
export function decodeJwt(token: string): JwtPayload | null {
  const segment = token.split('.')[1];
  if (!segment) return null;

  try {
    const payload = decodeSegment(segment);
    return isJwtPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

/**
 * ¿Ya se venció? Estos tokens duran 7 días.
 *
 * `exp` viene en SEGUNDOS desde 1970 y `Date.now()` en milisegundos: sin la
 * conversión, todo token parecería vencido.
 */
export function isExpired(payload: JwtPayload): boolean {
  return payload.exp * 1000 <= Date.now();
}
