import * as Location from 'expo-location';

/** Permiso que el sistema negó y que solo se recupera desde Ajustes. */
export type BlockedPermission = 'camera' | 'location';

export class PermissionDeniedError extends Error {
  constructor(readonly permission: BlockedPermission) {
    super(permission === 'camera' ? 'Sin permiso de cámara.' : 'Sin permiso de ubicación.');
  }
}

// Sin señal de GPS (interior, recién encendido) la lectura puede no llegar nunca
const GPS_TIMEOUT_MS = 15000;

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
  if (!permission.granted) throw new PermissionDeniedError('location');

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error('No pudimos obtener tu ubicación. Sal a un lugar abierto y vuelve a intentarlo.')),
      GPS_TIMEOUT_MS,
    );
  });

  try {
    const { coords } = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      timeout,
    ]);
    return { latitude: coords.latitude, longitude: coords.longitude };
  } finally {
    clearTimeout(timer);
  }
}
