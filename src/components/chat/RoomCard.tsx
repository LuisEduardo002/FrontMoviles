import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { GENERAL_ROOM } from '@/api/chat';
import Card from '@/components/ui/Card';
import { Caption, Heading } from '@/components/ui/Typography';
import { colors } from '@/theme/tokens';
import type { ChatRoom } from '@/types';

/** Una sala en la lista del chat: la general o la de un evento. */
export default function RoomCard({ room }: { room: ChatRoom }) {
  const isGeneral = room.room === GENERAL_ROOM;

  return (
    <Card onPress={() => router.push({ pathname: '/chat/[room]', params: { room: room.room, name: room.name } })}>
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
