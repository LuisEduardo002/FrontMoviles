import { Pressable, Text, View } from 'react-native';
import type { ChatMessage } from '../types';
import Avatar from './Avatar';
import Badge from './Badge';

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
    <View className={`flex-row items-end gap-2 ${mine ? 'justify-end' : ''}`}>
      {!mine && <Avatar nickname={message.user.nickname} url={message.user.avatarUrl} size="sm" />}
      <Pressable
        onLongPress={onLongPress}
        disabled={!onLongPress}
        className={`max-w-[80%] gap-1 rounded-md px-3 py-2 ${
          mine ? 'rounded-br-sm border border-primary/40 bg-primary/15' : 'rounded-bl-sm bg-surface'
        }`}>
        {!mine && (
          <View className="flex-row items-center gap-2">
            <Text className="font-body-semibold text-caption text-secondary">{message.user.nickname}</Text>
            {message.user.role === 'ADMIN' && <Badge text="Admin" tone="secondary" />}
          </View>
        )}
        <Text className="font-body text-body text-ink">{message.content}</Text>
        <Text className={`font-body text-caption text-ink/60 ${mine ? 'text-right' : ''}`}>
          {time(message.createdAt)}
        </Text>
      </Pressable>
    </View>
  );
}
