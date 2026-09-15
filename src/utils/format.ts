/**
 * Formato de fechas centralizado: el backend habla ISO 8601 y las pantallas
 * muestran texto corto en español. Si cambia el formato, se cambia aquí.
 */

/** "2026-09-20" -> "20 sep 2026". Si no parsea, devuelve el texto original. */
export function formatDate(iso: string): string {
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** "2026-09-10T18:32:00.000Z" -> "10 sep 2026, 6:32 p. m.". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Valida el formato que piden los formularios: YYYY-MM-DD. */
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Hoy en YYYY-MM-DD, para precargar `scannedAt` en el formulario de escaneos. */
export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
