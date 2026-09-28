import { Pressable, Text, View } from 'react-native';
import { hapticSelect } from '../utils/haptics';

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
  return (
    <Pressable
      onPress={() => {
        if (!selected) hapticSelect();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`min-h-[40px] items-center justify-center rounded-full border-2 px-3 py-2 ${
        grow ? 'flex-1' : ''
      } ${selected ? 'border-secondary bg-secondary/15' : 'border-disabled active:bg-disabled/40'}`}>
      <Text
        numberOfLines={1}
        className={`font-body-semibold text-caption ${selected ? 'text-secondary' : 'text-ink/70'}`}>
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
    <View className="gap-2">
      {!!label && <Text className="font-body-semibold text-body text-ink">{label}</Text>}
      <View className="flex-row gap-2">
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
