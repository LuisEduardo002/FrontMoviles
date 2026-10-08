import { listRooms } from '@/api/chat';
import { useFocusLoad } from '@/hooks/useFocusLoad';

/** Salas del chat: la general y una por cada evento activo. */
export function useChatRooms() {
  const { data: rooms, ...state } = useFocusLoad(listRooms, []);
  return { rooms, ...state };
}
