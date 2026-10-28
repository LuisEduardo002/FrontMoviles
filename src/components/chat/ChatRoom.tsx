import { Stack } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatComposer from '@/components/chat/ChatComposer';
import Notice from '@/components/ui/Notice';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import { Caption } from '@/components/ui/Typography';
import { ChatRoomToken } from '@/theme/Token';
import { useChatComposer } from '@/hooks/useChatComposer';
import { useChatModeration } from '@/hooks/useChatModeration';
import { useChatRoom } from '@/hooks/useChatRoom';
import { useRole } from '@/hooks/useRole';

/** Alto del header estándar de iOS: el teclado sube desde el borde de la pantalla, no desde el header. */
const HEADER_HEIGHT = 44;

/**
 * Una sala del chat en vivo. La lista va invertida: el último mensaje queda
 * abajo, junto a la caja de texto, y al subir se cargan los anteriores.
 */
export default function ChatRoom({ room, name }: { room: string; name?: string }) {
  const { user } = useRole();
  const chat = useChatRoom(room);
  const composer = useChatComposer(chat.send);
  const moderation = useChatModeration(chat.remove);
  const insets = useSafeAreaInsets();

  if (chat.isLoading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView
      className={ChatRoomToken.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top + HEADER_HEIGHT}>
      <Stack.Screen options={{ title: name ?? 'Chat' }} />

      <FlatList
        inverted
        className={ChatRoomToken.list}
        data={chat.messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            mine={item.user.id === user?.id}
            onLongPress={moderation.moderate && (() => void moderation.moderate?.(item))}
          />
        )}
        contentContainerClassName={ChatRoomToken.listContent}
        onEndReached={() => void chat.loadOlder()}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          // En una lista invertida el vacío sale de cabeza: se voltea de nuevo
          <View style={{ transform: [{ scaleY: -1 }] }}>
            <EmptyState icon="forum-outline" title="Nadie ha escrito aún" message="Rompe el hielo: propón una cacería." />
          </View>
        }
      />

      <View className={ChatRoomToken.composer}
        style={{ paddingBottom: Math.max(insets.bottom, ChatRoomToken.composerMinBottom) }}>
        <Notice message={composer.error ?? moderation.error ?? chat.error} />
        {!chat.isConnected && !chat.error && <Caption>Conectando con el chat…</Caption>}
        <ChatComposer
          draft={composer.draft}
          onChange={composer.setDraft}
          onSend={() => void composer.submit()}
          canSend={composer.canSend}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
