import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, TextInput, View } from 'react-native';
import { inputClassName, inputStyle } from '@/components/ui/inputStyle';
import { useInputFocus } from '@/hooks/useInputFocus';
import { ChatComposerToken } from '@/theme/Token';
import { colors, glow } from '@/theme/tokens';

/** La caja de texto del chat con su botón de enviar. */
export default function ChatComposer({
  draft,
  onChange,
  onSend,
  canSend,
}: {
  draft: string;
  onChange: (text: string) => void;
  onSend: () => void;
  canSend: boolean;
}) {
  const focus = useInputFocus();
  const state = focus.isFocused ? 'focused' : 'default';

  return (
    <View className={ChatComposerToken.container}>
      <TextInput
        className={`${ChatComposerToken.input} ${inputClassName(state)} ${ChatComposerToken.inputMaxHeight}`}
        style={inputStyle(state)}
        value={draft}
        onChangeText={onChange}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        placeholder="Escribe un mensaje"
        placeholderTextColor={colors.disabledText}
        multiline
        maxLength={500}
        onSubmitEditing={onSend}
        submitBehavior="submit"
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel="Enviar mensaje"
        className={`${ChatComposerToken.send} ${ChatComposerToken.sendState[canSend ? 'active' : 'disabled']}`}
        style={canSend ? { boxShadow: glow.primary } : undefined}>
        <MaterialDesignIcons name="send" size={ChatComposerToken.sendIconSize} color={canSend ? colors.inkInverted : colors.disabledText} />
      </Pressable>
    </View>
  );
}
