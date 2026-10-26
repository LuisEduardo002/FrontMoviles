import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, TextInput, View } from 'react-native';
import { inputClassName, inputStyle } from '@/components/ui/inputStyle';
import { useInputFocus } from '@/hooks/useInputFocus';
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
    <View className="flex-row items-end gap-2">
      <TextInput
        className={`flex-1 ${inputClassName(state)} max-h-[120px]`}
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
        className={`h-[48px] w-[48px] items-center justify-center rounded-full ${
          canSend ? 'bg-primary active:opacity-80' : 'bg-disabled'
        }`}
        style={canSend ? { boxShadow: glow.primary } : undefined}>
        <MaterialDesignIcons name="send" size={22} color={canSend ? colors.inkInverted : colors.disabledText} />
      </Pressable>
    </View>
  );
}
