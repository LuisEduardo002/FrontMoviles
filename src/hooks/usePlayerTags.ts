import { listPlayerTags } from '@/api/tags';
import { useFocusLoad } from '@/hooks/useFocusLoad';
import type { PlayerTag } from '@/types';

const NO_TAGS: PlayerTag[] = [];

/**
 * Los tags que el jugador puede ver (GET /nfc-tags con su rol). Es el mismo
 * contrato que alimenta la lista del evento: el backend ya omite el `code` y
 * las coordenadas de los tags ocultos.
 *
 * `useFocusLoad` recarga al volver a la pestaña y expone loading/error/refresh.
 * No hace falta un estado `status`: la pantalla decide con `isLoading` y `error`.
 */
export function usePlayerTags() {
  const { data, ...state } = useFocusLoad<PlayerTag[]>(listPlayerTags, NO_TAGS);
  return { tags: data, ...state };
}
