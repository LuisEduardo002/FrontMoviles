import { Stack } from 'expo-router';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatComposer from '@/components/chat/ChatComposer';
import Notice from '@/components/ui/Notice';
import { EmptyState, LoadingScreen } from '@/components/ui/Screen';
import { Caption } from '@/components/ui/Typography';
import { useChatComposer } from '@/hooks/useChatComposer';
import { useChatModeration } from '@/hooks/useChatModeration';
import { useChatRoom } from '@/hooks/useChatRoom';
import { useKeyboardOffset } from '@/hooks/useKeyboardOffset';
import { useRole } from '@/hooks/useRole';

/**
 * Una sala del chat en vivo. La lista va invertida: el último mensaje queda
 * abajo, junto a la caja de texto, y al subir se cargan los anteriores.
 */
export default function ChatRoom({ room, name }: { room: string; name?: string }) {
  const { user } = useRole();
  const chat = useChatRoom(room);
  const composer = useChatComposer(chat.send);
  const moderation = useChatModeration(chat.remove);
  const offset = useKeyboardOffset();

  if (chat.isLoading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={offset.top}>
      <Stack.Screen options={{ title: name ?? 'Chat' }} />

      <FlatList
        inverted
        className="flex-1"
        data={chat.messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            mine={item.user.id === user?.id}
            onLongPress={moderation.moderate && (() => void moderation.moderate?.(item))}
          />
        )}
        contentContainerClassName="gap-2 p-3"
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

      <View className="gap-2 border-t border-disabled bg-surface p-3" style={{ paddingBottom: offset.bottom }}>
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
