import { Alert, Platform } from 'react-native';

/**
 * Confirmación antes de una acción destructiva. Devuelve true si el usuario
 * aceptó.
 *
 * `Alert.alert` no hace nada en web (react-native-web lo deja vacío), así que
 * ahí se usa el `confirm` del navegador. Es la única razón de este archivo: no
 * llames a `Alert` directamente desde una pantalla.
 */
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel = 'Eliminar',
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(globalThis.confirm(`${title}\n\n${message}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
