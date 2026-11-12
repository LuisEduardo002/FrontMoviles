import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { currentPosition, PermissionDeniedError } from '@/utils/scan';

/** Estado del permiso de ubicación, en los términos que usa el mapa. */
export type LocationPermissionState = 'undetermined' | 'granted' | 'denied';

export interface UserPosition {
  latitude: number;
  longitude: number;
}

function permissionState(status: Location.PermissionStatus): LocationPermissionState {
  if (status === Location.PermissionStatus.GRANTED) return 'granted';
  if (status === Location.PermissionStatus.UNDETERMINED) return 'undetermined';
  return 'denied';
}

/**
 * Permiso y posición del jugador para el mapa.
 *
 * No bloquea la pantalla si falta el permiso: `MapStatusView` muestra el aviso
 * y los tags se siguen viendo. La lectura del GPS reutiliza `currentPosition`
 * (utils/scan), que es la misma que usa el escaneo, con su timeout.
 */
export function useUserLocation() {
  const [permission, setPermission] = useState<LocationPermissionState>('undetermined');
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setLocating] = useState(true);
  const mounted = useRef(true);
  // Si el usuario reintenta mientras el GPS anterior sigue vivo, gana el último.
  const requestId = useRef(0);

  useEffect(() => {
    // En StrictMode el efecto se monta, se limpia y se vuelve a montar: hay que
    // devolver el ref a `true` o las respuestas async se descartarían siempre.
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const locate = useCallback(async (ask: boolean) => {
    const id = ++requestId.current;
    setLocating(true);
    setError(null);
    try {
      const result = ask
        ? await Location.requestForegroundPermissionsAsync()
        : await Location.getForegroundPermissionsAsync();
      if (!mounted.current || id !== requestId.current) return;

      setPermission(permissionState(result.status));
      setCanAskAgain(result.canAskAgain);
      if (!result.granted) {
        setPosition(null);
        return;
      }

      // `currentPosition` vuelve a pedir el permiso, pero ya está concedido:
      // no muestra otro diálogo y nos deja su timeout de GPS.
      const next = await currentPosition();
      if (!mounted.current || id !== requestId.current) return;

      setPosition(next);
    } catch (failure) {
      if (!mounted.current || id !== requestId.current) return;
      if (failure instanceof PermissionDeniedError) {
        setPermission('denied');
        setPosition(null);
      } else setError((failure as Error).message);
    } finally {
      if (mounted.current && id === requestId.current) setLocating(false);
    }
  }, []);

  useEffect(() => {
    void locate(true);
  }, [locate]);

  // Al volver de Ajustes el permiso pudo cambiar: se relee sin volver a preguntar.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void locate(false);
    });
    return () => subscription.remove();
  }, [locate]);

  const request = useCallback(() => void locate(true), [locate]);
  const refresh = useCallback(() => void locate(false), [locate]);

  return {
    permission,
    canAskAgain,
    position,
    error,
    isLocating,
    request,
    refresh,
  };
}
