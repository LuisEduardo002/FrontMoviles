import { Text, View } from 'react-native';
import { glow } from '../theme/tokens';

/**
 * Etiqueta de estado en mayúsculas (token `overline`).
 *
 * - `primary`: activo, puntos, éxito. Lleva resplandor.
 * - `secondary`: información (rol ADMIN, evento asociado).
 * - `muted`: estados apagados (inactivo, oculto).
 */
type Tone = 'primary' | 'secondary' | 'muted';

const TONE: Record<Tone, { box: string; text: string }> = {
  primary: { box: 'border-primary/50 bg-primary/10', text: 'text-primary' },
  secondary: { box: 'border-secondary/50 bg-secondary/10', text: 'text-secondary' },
  muted: { box: 'border-disabled bg-disabled/30', text: 'text-ink/70' },
};

export default function Badge({ text, tone = 'muted' }: { text: string; tone?: Tone }) {
  return (
    <View
      className={`self-start rounded-sm border px-2 py-1 ${TONE[tone].box}`}
      style={tone === 'primary' ? { boxShadow: glow.primary } : undefined}>
      <Text className={`font-data text-overline uppercase ${TONE[tone].text}`}>{text}</Text>
    </View>
  );
}
