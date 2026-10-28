import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { GENERAL_ROOM } from '@/api/chat';
import Card from '@/components/ui/Card';
import { Caption, Heading } from '@/components/ui/Typography';
import { RoomCardToken } from '@/theme/Token';
import { colors } from '@/theme/tokens';
import type { ChatRoom } from '@/types';

/** Una sala en la lista del chat: la general o la de un evento. */
export default function RoomCard({ room }: { room: ChatRoom }) {
  const isGeneral = room.room === GENERAL_ROOM;

  return (
    <Card onPress={() => router.push({ pathname: '/chat/[room]', params: { room: room.room, name: room.name } })}>
      <View className={RoomCardToken.identity}>
        <View className={RoomCardToken.icon}>
          <MaterialDesignIcons name={isGeneral ? 'forum' : 'calendar-star'} size={RoomCardToken.iconSize} color={colors.secondary} />
        </View>
        <View className={RoomCardToken.identityText}>
          <Heading level="h3" numberOfLines={1}>
            {room.name}
          </Heading>
          <Caption>{isGeneral ? 'Todos los cazadores' : 'Sala del evento'}</Caption>
        </View>
      </View>
    </Card>
  );
}
