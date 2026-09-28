import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { GENERAL_ROOM, listRooms } from '../../src/api/chat';
import Card from '../../src/components/Card';
import ListScreen from '../../src/components/ListScreen';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import { Caption, Heading } from '../../src/components/Typography';
import { useFocusLoad } from '../../src/hooks/useFocusLoad';
import { colors } from '../../src/theme/tokens';
import type { ChatRoom } from '../../src/types';

/**
 * Salas del chat: la general, donde hablan todos, y una por cada evento
 * activo para coordinar la cacería de ese evento.
 */
export default function Chat() {
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

function RoomCard({ room }: { room: ChatRoom }) {
  const isGeneral = room.room === GENERAL_ROOM;

  return (
    <Card
      onPress={() => router.push({ pathname: '/chat/[room]', params: { room: room.room, name: room.name } })}>
      <View className="flex-row items-center gap-3">
        <View className="h-[44px] w-[44px] items-center justify-center rounded-full bg-secondary/15">
          <MaterialDesignIcons name={isGeneral ? 'forum' : 'calendar-star'} size={24} color={colors.secondary} />
        </View>
        <View className="flex-1 gap-1">
          <Heading level="h3" numberOfLines={1}>
            {room.name}
          </Heading>
          <Caption>{isGeneral ? 'Todos los cazadores' : 'Sala del evento'}</Caption>
        </View>
      </View>
    </Card>
  );
}
