/**
 * Cliente HTTP: el ÚNICO archivo de la app que sabe usar `fetch`.
 *
 * Todo lo demás (pantallas, contexto de sesión) llama a funciones con nombre de
 * negocio. Si mañana cambia la forma de hablar con el servidor, se cambia aquí
 * y nada más.
 */

import { API_URL, REQUEST_TIMEOUT_MS } from '../config/env';
import type { ApiError } from '../types';

/**
 * Token JWT de la sesión activa, en memoria.
 *
 * La copia que sobrevive al cierre de la app está en `src/session/storage.ts`;
 * esta es solo la que se adjunta a cada petición. La pone el contexto de sesión
 * al entrar (token) y al salir (null).
 */
let token: string | null = null;

export function setToken(value: string | null): void {
  token = value;
}

/**
 * Saca de la respuesta del servidor un mensaje legible para el usuario.
 *
 * NestJS responde sus errores así:
 *   { statusCode: 409, message: "El correo ya está registrado.", error: "Conflict" }
 * pero `message` también puede ser un arreglo con un texto por campo. Aquí se
 * normaliza a un solo string, que es lo que una pantalla puede mostrar.
 */
function readErrorMessage(data: unknown, status: number, path: string): string {
  const message = (data as Partial<ApiError> | null)?.message;

  // El 500 va PRIMERO: este backend no valida el cuerpo de la petición, así que
  // si falta un campo bcrypt revienta con `undefined` y NestJS responde
  // { statusCode: 500, message: "Internal server error" }. Ese texto genérico
  // no le dice nada al usuario, y como viene en `message` taparía al de abajo.
  if (status === 500 && (typeof message !== 'string' || message === 'Internal server error')) {
    return 'El servidor no pudo procesar los datos enviados. Revisa que no falte ningún campo.';
  }

  if (typeof message === 'string' && message) return message;

  if (Array.isArray(message)) {
    const lines = message.filter((line): line is string => typeof line === 'string');
    if (lines.length > 0) return lines.join('\n');
  }

  return `Error ${status} al llamar ${path}`;
}

/**
 * Hace una petición a la API y devuelve el JSON ya tipado.
 *
 * - Sin `body` -> GET. Con `body` -> POST enviándolo como JSON.
 * - Si hay sesión activa, adjunta la cabecera `Authorization: Bearer <token>`.
 * - Si el servidor responde con error, lanza un Error con SU mensaje, que es
 *   el que la pantalla muestra al usuario.
 * - Si el servidor no responde en 10 segundos, corta y avisa: sin esto, con el
 *   backend caído la petición se queda colgada y el usuario ve un spinner
 *   eterno.
 *
 * @param path Ruta relativa a la API, empezando por "/". Ej: "/auth/login".
 */
export async function request<T>(path: string, body?: unknown): Promise<T> {
  // `AbortController` es el mando a distancia de la petición: `fetch` la cancela
  // cuando se llama a `abort()`, y eso es lo que hace el temporizador.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Sintaxis de "propagación condicional": si no hay token, no se añade
        // la cabecera en lugar de mandarla vacía.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (failure) {
    // Dos causas posibles: se venció el temporizador (AbortError) o no hubo
    // respuesta del todo (servidor apagado, IP equivocada, o el dispositivo no
    // alcanza esa dirección).
    if ((failure as Error).name === 'AbortError') {
      throw new Error(`El servidor (${API_URL}) tardó demasiado en responder.`);
    }

    throw new Error(
      `No se pudo conectar con ${API_URL}. ¿Está encendido el servidor y es correcta la IP?`,
    );
  } finally {
    // Se limpia siempre: si la petición terminó bien, dejar vivo el temporizador
    // abortaría una petición que ya no existe.
    clearTimeout(timeout);
  }

  // El backend responde JSON en /auth, pero una caída puede devolver HTML: si no
  // se puede leer como JSON, se sigue con un objeto vacío en vez de reventar.
  const data: unknown = await response.json().catch(() => ({}));

  // `response.ok` es cualquier 2xx. Importante: este backend responde 201 al
  // login (no define @HttpCode(200)), así que comparar contra 200 lo rompería.
  if (!response.ok) {
    throw new Error(readErrorMessage(data, response.status, path));
  }

  return data as T;
}
