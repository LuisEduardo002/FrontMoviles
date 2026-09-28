import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';
import { colors, glow } from '../theme/tokens';

/**
 * Tarjeta (dict_style.md §3.3). Con `onPress` toda la tarjeta se puede tocar
 * y muestra un chevron: en las listas no hace falta un botón "Ver" aparte.
 */
export default function Card({
  onPress,
  className,
  children,
}: PropsWithChildren<{ onPress?: () => void; className?: string }>) {
  const base = `rounded-md bg-surface p-3 ${className ?? ''}`;

  if (!onPress) {
    return (
      <View className={`gap-3 ${base}`} style={{ boxShadow: glow.card }}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`flex-row items-center gap-3 active:opacity-80 ${base}`}
      style={{ boxShadow: glow.card }}>
      <View className="flex-1 gap-2">{children}</View>
      <MaterialDesignIcons name="chevron-right" size={24} color={colors.disabledText} />
    </Pressable>
  );
}
