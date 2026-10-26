import { listRooms } from '@/api/chat';
import RoomCard from '@/components/chat/RoomCard';
import ListScreen from '@/components/ui/ListScreen';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import { Caption } from '@/components/ui/Typography';
import { useFocusLoad } from '@/hooks/useFocusLoad';

/**
 * Salas del chat: la general, donde hablan todos, y una por cada evento
 * activo para coordinar la cacería de ese evento.
 */
export default function ChatRooms() {
  const { data: rooms, isLoading, isRefreshing, error, refresh } = useFocusLoad(listRooms, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <ListScreen
      items={rooms.map((room) => ({ ...room, id: room.room }))}
      total={rooms.length}
      noun={['sala', 'salas']}
      error={error}
      isRefreshing={isRefreshing}
      onRefresh={refresh}
      controls={<Caption>Ponte de acuerdo con otros cazadores para ir juntos por un tag.</Caption>}
      renderItem={(room) => <RoomCard room={room} />}
      empty={<EmptyState icon="forum-outline" title="Sin salas" message="Desliza hacia abajo para reintentar." />}
    />
  );
}
