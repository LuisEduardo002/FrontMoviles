import { Pressable, Text, View } from 'react-native';
import { StatTileToken } from '../theme/Token';
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
  const className = `${StatTileToken.container} ${highlight ? StatTileToken.highlight : ''}`;
  const style = { boxShadow: highlight ? glow.primary : glow.card };
  const textColor = StatTileToken.textColor[highlight ? 'highlight' : 'default'];
  const content = (
    <>
      <Text className={`${StatTileToken.value} ${textColor}`}>
        {value}
      </Text>
      <Text className={`${StatTileToken.label} ${textColor}`}>
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
      className={`${className} ${StatTileToken.pressed}`}
      style={style}>
      {content}
    </Pressable>
  );
}
