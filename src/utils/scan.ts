import * as Location from 'expo-location';

/**
 * El QR puede traer el código solo ("NFC-MAN-001") o dentro de una URL
 * (".../tag/NFC-MAN-001"): en los dos casos cuenta el último tramo.
 */
export function codeFromQr(data: string): string {
  const parts = data.trim().split('/').filter(Boolean);
  return (parts[parts.length - 1] ?? '').toUpperCase();
}

/** La posición del jugador al escanear: el servidor mide la distancia al tag. */
export async function currentPosition() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Sin tu ubicación no se puede validar el escaneo. Activa el permiso de ubicación.');
  }
  const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  return { latitude: coords.latitude, longitude: coords.longitude };
}
