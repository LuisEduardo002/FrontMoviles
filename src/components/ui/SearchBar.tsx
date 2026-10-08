import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useInputFocus } from '@/hooks/useInputFocus';
import { colors } from '@/theme/tokens';
import { inputClassName, inputStyle } from '@/components/ui/inputStyle';

/**
 * Buscador de las listas del panel. Mismo estilo que `Field`, pero sin
 * react-hook-form: las listas filtran en memoria y no necesitan validación.
 */
export default function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
}) {
  const focus = useInputFocus();
  const state = focus.isFocused ? 'focused' : 'default';

  return (
    <View className="justify-center">
      <TextInput
        className={`${inputClassName(state)} pl-6 pr-6`}
        style={inputStyle(state)}
        value={value}
        onChangeText={onChange}
        onFocus={focus.onFocus}
        onBlur={focus.onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.disabledText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      <View pointerEvents="none" className="absolute left-3">
        <MaterialDesignIcons
          name="magnify"
          size={20}
          color={focus.isFocused ? colors.secondary : colors.disabledText}
        />
      </View>
      {!!value && (
        <Pressable
          onPress={() => onChange('')}
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={8}
          className="absolute right-3">
          <MaterialDesignIcons name="close-circle" size={20} color={colors.disabledText} />
        </Pressable>
      )}
    </View>
  );
}
