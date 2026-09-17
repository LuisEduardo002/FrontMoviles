/**
 * Configuración de entorno. Es el ÚNICO lugar donde vive la dirección del
 * backend: si cambia la IP, se cambia aquí (o en `.env`) y nada más.
 */

/**
 * Dirección del backend de NFHunter (NestJS, puerto 3000).
 *
 * Va SIN `/api`: el servidor no define un prefijo global y sus controladores
 * cuelgan de la raíz, así que las rutas son `/auth/login` y `/auth/register`.
 * (`/api/docs` es solo la ruta de Swagger, no un prefijo de la API.)
 *
 * El valor sale de `.env`; el de abajo es el respaldo por si ese archivo falta.
 * Según dónde corra la app, la dirección correcta cambia:
 *
 *   Dispositivo físico (Expo Go, mismo WiFi) ... http://192.168.114.241:3000
 *   Emulador de Android ........................ http://10.0.2.2:3000
 *   Simulador de iOS / navegador ............... http://localhost:3000
 *
 * OJO: `localhost` desde un celular o desde el emulador de Android apunta al
 * propio dispositivo, no al computador. Por eso el respaldo es la IP de la red
 * local, que es la que sirve en más casos. Esa IP CAMBIA al reconectarse al
 * WiFi: cuando falle la conexión, revísala con `hostname -I` y actualiza `.env`.
 *
 * `process.env.EXPO_PUBLIC_API_URL` tiene que escribirse tal cual, con notación
 * de punto: Expo busca ese texto en el código y lo reemplaza por el valor al
 * compilar. Guardarlo en una variable intermedia o leerlo con corchetes no
 * funcionaría. Al cambiar `.env` hay que recargar la app por completo.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.114.241:3000';

/** Cuánto se espera una respuesta antes de darla por perdida (10 segundos). */
export const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Fuente de datos de los CRUD del panel admin.
 *
 * - `true`: usa el almacén en memoria de `src/api/mockStore.ts` para desarrollar
 *   el front sin backend.
 * - `false` (valor por defecto): llama al backend real con las rutas de `src/api/users.ts`
 *   y `src/api/events.ts`. `src/api/tags.ts` siempre va al backend (`/nfc-tags`).
 *
 * Para usar mocks temporalmente: `EXPO_PUBLIC_USE_MOCK=true` en `.env` y
 * recarga completa de la app. Si una ruta del backend se llama distinto, se
 * cambia SOLO en esos archivos, nada más.
 */
export const USE_MOCK = (process.env.EXPO_PUBLIC_USE_MOCK ?? 'false') !== 'false';
