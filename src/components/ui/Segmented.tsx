import { Pressable, Text, View } from 'react-native';
import { ChipToken, SegmentedToken } from '@/theme/Token';
import { hapticSelect } from '@/utils/haptics';

/**
 * Selector de una opción entre pocas: filtros de las listas, rol, visibilidad,
 * estado de un evento. La opción elegida va en cian (selección, §2).
 *
 * `Chip` se exporta para listas de opciones que no caben en una fila
 * (ver `EventSelect`).
 */
export function Chip({
  label,
  selected,
  onPress,
  grow,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  grow?: boolean;
}) {
  const state = selected ? 'selected' : 'default';

  return (
    <Pressable
      onPress={() => {
        if (!selected) hapticSelect();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`${ChipToken.container} ${grow ? ChipToken.grow : ''} ${ChipToken.state[state]}`}>
      <Text
        numberOfLines={1}
        className={`${ChipToken.label} ${ChipToken.labelState[state]}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function Segmented<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View className={SegmentedToken.container}>
      {!!label && <Text className={SegmentedToken.label}>{label}</Text>}
      <View className={SegmentedToken.options}>
        {options.map((option) => (
          <Chip
            key={String(option.value)}
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
            grow
          />
        ))}
      </View>
    </View>
  );
}
