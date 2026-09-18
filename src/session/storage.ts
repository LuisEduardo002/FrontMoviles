/**
 * Guarda el token de sesión donde sobreviva al cierre de la app.
 *
 * El token es una credencial, no una preferencia: en celular va al llavero del
 * sistema (Keychain en iOS, Keystore en Android) a través de `expo-secure-store`.
 *
 * Pero SecureStore NO existe en web, así que ahí se cae a `localStorage`. Es
 * menos seguro —cualquier script de la página puede leerlo—, y es el precio de
 * poder probar la app en el navegador.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/** SecureStore solo acepta letras, números, ".", "-" y "_" en la clave. */
const TOKEN_KEY = 'nfhunter.access_token';

const isWeb = Platform.OS === 'web';

/** Devuelve el token guardado, o null si no hay sesión previa. */
export async function loadToken(): Promise<string | null> {
  try {
    if (isWeb) return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    // El llavero puede fallar (dispositivo sin desbloquear, modo incógnito en
    // web...). No poder leer el token no es más grave que no tenerlo: se entra
    // como si nadie hubiera iniciado sesión.
    return null;
  }
}

/** Guarda el token para las próximas aperturas de la app. */
export async function saveToken(token: string): Promise<void> {
  try {
    if (isWeb) globalThis.localStorage?.setItem(TOKEN_KEY, token);
    else await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    // Si no se pudo guardar, la sesión sigue viva en memoria: el usuario usa la
    // app con normalidad y solo tendrá que volver a entrar la próxima vez.
  }
}

/** Borra el token: al cerrar sesión y cuando se encuentra uno vencido. */
export async function removeToken(): Promise<void> {
  try {
    if (isWeb) globalThis.localStorage?.removeItem(TOKEN_KEY);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Nada que hacer: si el llavero no responde, el token de memoria ya se
    // limpió y la app queda sin sesión de todos modos.
  }
}
