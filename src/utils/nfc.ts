import { Platform } from 'react-native';
import { codeFromQr } from '@/utils/scan';

/**
 * NFC solo en Android y solo con el dev build: en Expo Go el módulo nativo no
 * existe, así que se carga bajo demanda y cualquier fallo se trata como "sin
 * NFC" para que la app siga abriendo (el QR y el código manual siempre están).
 */
type NfcModule = typeof import('react-native-nfc-manager');

function loadNfc(): NfcModule | null {
  if (Platform.OS !== 'android') return null;
  try {
    return require('react-native-nfc-manager') as NfcModule;
  } catch {
    return null;
  }
}

export type NfcStatus = 'unsupported' | 'disabled' | 'ready';

/** Si el celular puede leer NFC y si el usuario lo tiene encendido. */
export async function nfcStatus(): Promise<NfcStatus> {
  const nfc = loadNfc();
  if (!nfc) return 'unsupported';
  try {
    if (!(await nfc.default.isSupported())) return 'unsupported';
    await nfc.default.start();
    return (await nfc.default.isEnabled()) ? 'ready' : 'disabled';
  } catch {
    return 'unsupported';
  }
}

/** Lleva a los ajustes de NFC del sistema. */
export async function openNfcSettings() {
  try {
    await loadNfc()?.default.goToNfcSetting();
  } catch {
    // Sin pantalla de ajustes disponible: el usuario lo enciende a mano.
  }
}

/** Corta la espera de un sticker (el `readNfcCode` pendiente falla). */
export async function cancelNfcRead() {
  try {
    await loadNfc()?.default.cancelTechnologyRequest();
  } catch {
    // Ya no había lectura en curso.
  }
}

/**
 * El texto de un registro NDEF "T": primer byte = banderas (bit 7: UTF-16,
 * bits 0-5: largo del idioma), luego el idioma ("es") y el texto. Se admite
 * también una URL con el código al final, igual que el QR.
 */
export function codeFromPayload(payload: number[]): string {
  const [status = 0, ...rest] = payload;
  if (status & 0x80) return ''; // UTF-16: los códigos de los tags son ASCII
  const text = rest.slice(status & 0x3f);
  const decoded = text.map((byte) => `%${byte.toString(16).padStart(2, '0')}`).join('');
  try {
    return codeFromQr(decodeURIComponent(decoded));
  } catch {
    return '';
  }
}

/**
 * Espera a que el jugador acerque un sticker y devuelve su código. Falla con
 * un mensaje legible si el sticker no trae un texto NDEF; si se cancela con
 * `cancelNfcRead`, falla con un error que la pantalla debe ignorar.
 */
export async function readNfcCode(): Promise<string> {
  const nfc = loadNfc();
  if (!nfc) throw new Error('Este celular no puede leer NFC. Usa el QR o escribe el código.');
  const { default: NfcManager, NfcTech } = nfc;
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    const record = tag?.ndefMessage?.[0];
    const code = record ? codeFromPayload(record.payload as number[]) : '';
    if (!code) throw new Error('Esa etiqueta no tiene un código de NFHunter. Prueba con otra o usa el QR.');
    return code;
  } finally {
    await cancelNfcRead();
  }
}
