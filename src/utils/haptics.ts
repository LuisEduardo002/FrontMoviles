/**
 * Háptica de NFHunter (dict_style.md §0): todo éxito o error se siente, no
 * solo se ve. En web usa la Vibration API, que muchos navegadores ignoran; por
 * eso cada llamada se traga su error: la vibración nunca debe romper un flujo.
 */

import * as Haptics from 'expo-haptics';

function fire(effect: () => Promise<void>) {
  try {
    effect().catch(() => {});
  } catch {
    // Plataforma sin motor háptico: se sigue sin vibrar.
  }
}

/** Botón primario pulsado. */
export function hapticTap() {
  fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Cambio de opción en un selector o filtro. */
export function hapticSelect() {
  fire(() => Haptics.selectionAsync());
}

/** Guardado, creación o escaneo exitoso. */
export function hapticSuccess() {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

/** Validación fallida o error del servidor. */
export function hapticError() {
  fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}
