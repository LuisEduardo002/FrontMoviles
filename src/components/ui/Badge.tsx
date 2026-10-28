import { Text, View } from 'react-native';
import { BadgeToken } from '@/theme/Token';
import { glow } from '@/theme/tokens';

/**
 * Etiqueta de estado en mayúsculas (token `overline`).
 *
 * - `primary`: activo, puntos, éxito. Lleva resplandor.
 * - `secondary`: información (rol ADMIN, evento asociado).
 * - `muted`: estados apagados (inactivo, oculto).
 */
type Tone = keyof typeof BadgeToken.tone;

export default function Badge({ text, tone = 'muted' }: { text: string; tone?: Tone }) {
  return (
    <View
      className={`${BadgeToken.container} ${BadgeToken.tone[tone].box}`}
      style={tone === 'primary' ? { boxShadow: glow.primary } : undefined}>
      <Text className={`${BadgeToken.text} ${BadgeToken.tone[tone].text}`}>{text}</Text>
    </View>
  );
}
