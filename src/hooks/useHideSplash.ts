import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Tiene que correr antes del primer render: por eso va al cargar el módulo,
// que el layout raíz importa al arrancar la app.
SplashScreen.preventAutoHideAsync();

/**
 * Mantiene el splash hasta que `ready` sea true. Así no parpadea el login
 * mientras se busca la sesión guardada antes de saltar al panel.
 */
export function useHideSplash(ready: boolean) {
  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);
}
