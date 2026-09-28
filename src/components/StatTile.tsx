import { Pressable, Text, View } from 'react-native';
import { glow } from '../theme/tokens';
import { Caption } from './Typography';

/**
 * Cifra grande del HUD (token `display`) con su etiqueta. Con `onPress` lleva
 * a la lista de donde sale la cifra. `highlight` la pinta en verde neón.
 */
export default function StatTile({
  value,
  label,
  detail,
  onPress,
  highlight,
}: {
  value: number | string;
  label: string;
  detail?: string;
  onPress?: () => void;
  highlight?: boolean;
}) {
  const className = `flex-1 gap-1 rounded-md bg-surface p-3 ${
    highlight ? 'border-[1.5px] border-primary' : ''
  }`;
  const style = { boxShadow: highlight ? glow.primary : glow.card };
  const content = (
    <>
      <Text className={`font-data-black text-display ${highlight ? 'text-primary' : 'text-ink'}`}>
        {value}
      </Text>
      <Text className={`font-body-semibold text-caption ${highlight ? 'text-primary' : 'text-ink'}`}>
        {label}
      </Text>
      {!!detail && <Caption>{detail}</Caption>}
    </>
  );

  if (!onPress) {
    return (
      <View className={className} style={style}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}${detail ? `, ${detail}` : ''}`}
      className={`${className} active:opacity-80`}
      style={style}>
      {content}
    </Pressable>
  );
}
