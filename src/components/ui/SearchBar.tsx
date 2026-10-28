import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { Pressable, TextInput, View } from 'react-native';
import { useInputFocus } from '@/hooks/useInputFocus';
import { SearchBarToken } from '@/theme/Token';
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
    <View className={SearchBarToken.container}>
      <TextInput
        className={`${inputClassName(state)} ${SearchBarToken.input}`}
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
      <View pointerEvents="none" className={SearchBarToken.searchIcon}>
        <MaterialDesignIcons
          name="magnify"
          size={SearchBarToken.iconSize}
          color={focus.isFocused ? colors.secondary : colors.disabledText}
        />
      </View>
      {!!value && (
        <Pressable
          onPress={() => onChange('')}
          accessibilityLabel="Limpiar búsqueda"
          hitSlop={8}
          className={SearchBarToken.clearButton}>
          <MaterialDesignIcons name="close-circle" size={SearchBarToken.iconSize} color={colors.disabledText} />
        </Pressable>
      )}
    </View>
  );
}
