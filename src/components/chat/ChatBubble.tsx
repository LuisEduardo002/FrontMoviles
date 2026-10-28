import { Pressable, Text, View } from 'react-native';
import { ChatBubbleToken } from '@/theme/Token';
import type { ChatMessage } from '@/types';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });

/**
 * Un mensaje del chat. Los propios van a la derecha en verde; los de los
 * demás, a la izquierda con su foto y apodo. `onLongPress` es la moderación
 * (solo se pasa cuando quien mira es ADMIN).
 */
export default function ChatBubble({
  message,
  mine,
  onLongPress,
}: {
  message: ChatMessage;
  mine: boolean;
  onLongPress?: () => void;
}) {
  return (
    <View className={`${ChatBubbleToken.row} ${mine ? ChatBubbleToken.rowMine : ''}`}>
      {!mine && <Avatar nickname={message.user.nickname} url={message.user.avatarUrl} size="sm" />}
      <Pressable
        onLongPress={onLongPress}
        disabled={!onLongPress}
        className={`${ChatBubbleToken.bubble} ${
          mine ? ChatBubbleToken.bubbleMine : ChatBubbleToken.bubbleOther
        }`}>
        {!mine && (
          <View className={ChatBubbleToken.author}>
            <Text className={ChatBubbleToken.authorName}>{message.user.nickname}</Text>
            {message.user.role === 'ADMIN' && <Badge text="Admin" tone="secondary" />}
          </View>
        )}
        <Text className={ChatBubbleToken.content}>{message.content}</Text>
        <Text className={`${ChatBubbleToken.time} ${mine ? ChatBubbleToken.timeMine : ''}`}>
          {time(message.createdAt)}
        </Text>
      </Pressable>
    </View>
  );
}
