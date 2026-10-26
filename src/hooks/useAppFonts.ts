import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Orbitron_500Medium,
  Orbitron_700Bold,
  Orbitron_800ExtraBold,
} from '@expo-google-fonts/orbitron';
import { useFonts } from 'expo-font';

/**
 * Carga las fuentes de dict_style.md. Devuelve true cuando se puede pintar:
 * si fallan, se sigue con las del sistema (mejor eso que un splash eterno).
 */
export function useAppFonts(): boolean {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_500Medium,
    Orbitron_700Bold,
    Orbitron_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  return fontsLoaded || !!fontError;
}
