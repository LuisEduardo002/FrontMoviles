/**
 * Alertas y confirmaciones de NFHunter. No uses `Alert.alert` ni el `confirm`
 * del navegador: se ven como el sistema y en web `Alert.alert` no hace nada.
 *
 * Estas funciones se llaman desde cualquier handler (no son hooks) y las
 * pinta `AlertHost`, que vive una sola vez en el layout raíz.
 */

export type AlertTone = 'danger' | 'success' | 'info';

export interface AlertOptions {
  title: string;
  message: string;
  tone?: AlertTone;
  /** Texto del botón principal. */
  confirmText?: string;
  /** Si viene, aparece un segundo botón que cancela. */
  cancelText?: string;
}

export interface AlertRequest extends AlertOptions {
  /** true si tocó el botón principal; false si canceló o cerró el diálogo. */
  resolve: (confirmed: boolean) => void;
}

let present: ((request: AlertRequest) => void) | null = null;

/** Lo usa `AlertHost` al montarse. Devuelve con qué desregistrarse. */
export function registerAlertHost(host: (request: AlertRequest) => void) {
  present = host;
  return () => {
    if (present === host) present = null;
  };
}

/** Muestra un aviso. Se resuelve cuando el usuario lo cierra. */
export function showAlert(options: AlertOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!present) {
      console.warn('showAlert sin AlertHost montado:', options.title);
      resolve(false);
      return;
    }
    present({ ...options, resolve });
  });
}

/**
 * Confirmación antes de una acción destructiva. Devuelve true si el usuario
 * aceptó.
 */
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel = 'Eliminar',
): Promise<boolean> {
  return showAlert({ title, message, tone: 'danger', confirmText: confirmLabel, cancelText: 'Cancelar' });
}
