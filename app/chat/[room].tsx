import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble from '../../src/components/ChatBubble';
import { inputClassName, inputStyle } from '../../src/components/inputStyle';
import Notice from '../../src/components/Notice';
import { EmptyState, LoadingScreen } from '../../src/components/Screen';
import { Caption } from '../../src/components/Typography';
import { useChatRoom } from '../../src/hooks/useChatRoom';
import { useSession } from '../../src/session/context';
import { colors, glow } from '../../src/theme/tokens';
import type { ChatMessage } from '../../src/types';
import { confirmDestructive } from '../../src/utils/dialog';
import { hapticError, hapticTap } from '../../src/utils/haptics';

/**
 * Una sala del chat en vivo. La lista va invertida: el último mensaje queda
 * abajo, junto a la caja de texto, y al subir se cargan los anteriores.
 */
export default function ChatRoomScreen() {
  const { room, name } = useLocalSearchParams<{ room: string; name?: string }>();
  const { user } = useSession();
  const { messages, isLoading, isConnected, error, send, loadOlder, remove } = useChatRoom(room);
  const [draft, setDraft] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [isFocused, setFocused] = useState(false);
  // El teclado sube desde el borde de la pantalla, no desde el header: hay
  // que descontar el header (44 en iOS) y la zona segura de arriba.
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 44;
  const isAdmin = user?.role === 'ADMIN';

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    hapticTap();
    setDraft('');
    const failure = await send(content);
    if (failure) {
      // El texto vuelve a la caja para no perderlo
      hapticError();
      setDraft(content);
    }
    setSendError(failure);
  };

  const moderate = async (message: ChatMessage) => {
    const confirmed = await confirmDestructive(
      'Borrar mensaje',
      `¿Borrar el mensaje de ${message.user.nickname}? Desaparece para todos.`,
      'Borrar',
    );
    if (confirmed) await remove(message.id).catch((failure: Error) => setSendError(failure.message));
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}>
      <Stack.Screen options={{ title: name ?? 'Chat' }} />

      <FlatList
        inverted
        className="flex-1"
        data={messages}
        keyExtractor={(message) => message.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            mine={item.user.id === user?.id}
            onLongPress={isAdmin ? () => void moderate(item) : undefined}
          />
        )}
        contentContainerClassName="gap-2 p-3"
        onEndReached={() => void loadOlder()}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          // En una lista invertida el vacío sale de cabeza: se voltea de nuevo
          <View style={{ transform: [{ scaleY: -1 }] }}>
            <EmptyState icon="forum-outline" title="Nadie ha escrito aún" message="Rompe el hielo: propón una cacería." />
          </View>
        }
      />

      <View
        className="gap-2 border-t border-disabled bg-surface p-3"
        // Sin tapar el indicador de inicio del iPhone
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Notice message={sendError ?? error} />
        {!isConnected && !error && <Caption>Conectando con el chat…</Caption>}
        <View className="flex-row items-end gap-2">
          <TextInput
            className={`flex-1 ${inputClassName(isFocused ? 'focused' : 'default')} max-h-[120px]`}
            style={inputStyle(isFocused ? 'focused' : 'default')}
            value={draft}
            onChangeText={setDraft}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Escribe un mensaje"
            placeholderTextColor={colors.disabledText}
            multiline
            maxLength={500}
            onSubmitEditing={() => void submit()}
            submitBehavior="submit"
          />
          <Pressable
            onPress={() => void submit()}
            disabled={!draft.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            className={`h-[48px] w-[48px] items-center justify-center rounded-full ${
              draft.trim() ? 'bg-primary active:opacity-80' : 'bg-disabled'
            }`}
            style={draft.trim() ? { boxShadow: glow.primary } : undefined}>
            <MaterialDesignIcons
              name="send"
              size={22}
              color={draft.trim() ? colors.inkInverted : colors.disabledText}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
