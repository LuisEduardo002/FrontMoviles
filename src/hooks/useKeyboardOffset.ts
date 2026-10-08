import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Alto del header estándar de iOS. */
const HEADER_HEIGHT = 44;

/**
 * Cuánto descontar al subir el contenido con el teclado: el teclado sube
 * desde el borde de la pantalla, no desde el header. `bottom` es el espacio
 * para no tapar el indicador de inicio del iPhone.
 */
export function useKeyboardOffset() {
  const insets = useSafeAreaInsets();
  return { top: insets.top + HEADER_HEIGHT, bottom: Math.max(insets.bottom, 16) };
}
